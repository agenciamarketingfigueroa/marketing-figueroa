import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const origin = supabaseUrl ? new URL(supabaseUrl).origin : '';
  const csp = [`default-src 'self'`, `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV !== 'production' ? "'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline'`, `img-src 'self' data:`, `font-src 'self'`,
    `connect-src 'self' ${origin} ${origin.replace('https:','wss:')}`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'`].join('; ');
  const headers = new Headers(request.headers); headers.set('x-nonce',nonce); headers.set('Content-Security-Policy',csp);
  let response = NextResponse.next({request:{headers}});
  if (supabaseUrl && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && /^\/(dashboard|mfa|setup-password|login|api\/report|api\/creative-image)(\/|$)/.test(request.nextUrl.pathname)) {
    const db = createServerClient(supabaseUrl,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{
      cookies:{getAll:() => request.cookies.getAll(),setAll(values) {
        values.forEach(({name,value}) => request.cookies.set(name,value));
        headers.set('cookie',request.cookies.toString());
        response = NextResponse.next({request:{headers}});
        values.forEach(({name,value,options}) => response.cookies.set(name,value,options));
      }},
    });
    await db.auth.getClaims();
  }
  response.headers.set('Content-Security-Policy',csp);
  response.headers.set('Cache-Control','private, no-store');
  return response;
}
export const config = {matcher:['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|woff2)$).*)']};
