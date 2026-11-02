import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';

export class ProviderError extends Error {
  constructor(public code: string) { super(code); }
}
export function secretMatches(actual: string | null, expected: string | undefined) {
  if (!actual || !expected) return false;
  return timingSafeEqual(createHash('sha256').update(actual).digest(), createHash('sha256').update(expected).digest());
}
export async function boundedJson(request: Request, maxBytes = 262144): Promise<unknown> {
  if (!request.body) throw new ProviderError('INVALID_BODY');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) { await reader.cancel(); throw new ProviderError('BODY_TOO_LARGE'); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally { reader.releaseLock(); }
}
/** Only caller-owned fixed endpoints; redirects disabled to prevent credential forwarding. */
export async function providerJson(url: URL, init: RequestInit = {}, deadline = Date.now() + 150000, fetcher = fetch): Promise<unknown> {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (Date.now() + 1500 >= deadline) throw new ProviderError('SYNC_TIME_BUDGET');
    let response: Response;
    try {
      response = await fetcher(url, { ...init, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(Math.min(20000, deadline - Date.now())) });
    } catch {
      if (attempt === 3) throw new ProviderError('PROVIDER_UNAVAILABLE');
      await new Promise(resolve => setTimeout(resolve, 500 * 2 ** attempt)); continue;
    }
    if (response.ok) return response.json();
    // Never include response bodies, URLs or Authorization headers in error logs.
    if (response.status === 401 || response.status === 403) throw new ProviderError('PROVIDER_AUTH');
    let graphTransient=false;
    if(url.hostname==='graph.facebook.com' && response.status===400) {
      const failure=await response.json().catch(()=>null) as {error?:{code?:number;is_transient?:boolean}}|null;
      if(failure?.error?.code===190) throw new ProviderError('PROVIDER_AUTH');
      graphTransient=failure?.error?.is_transient===true || [4,17,32,613,80004].includes(failure?.error?.code??0);
    }
    if (response.status !== 429 && response.status < 500 && !graphTransient) throw new ProviderError('PROVIDER_REQUEST');
    if (attempt === 3) throw new ProviderError(response.status === 429 ? 'PROVIDER_RATE_LIMIT' : 'PROVIDER_UNAVAILABLE');
    const retryAfter = response.headers.get('retry-after');
    const serverDelay = retryAfter ? (/^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Date.parse(retryAfter) - Date.now()) : 0;
    const delay = Math.max(500 * 2 ** attempt + Math.random() * 300, Number.isFinite(serverDelay) ? serverDelay : 0);
    if (Date.now() + delay + 1000 >= deadline) throw new ProviderError('PROVIDER_RATE_LIMIT');
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new ProviderError('PROVIDER_UNAVAILABLE');
}
export const errorCode = (error: unknown) => error instanceof ProviderError ? error.code : 'SYNC_FAILED';
