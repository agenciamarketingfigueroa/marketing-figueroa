/** Only Meta-owned image CDNs; never arbitrary URLs, redirects, credentials or non-HTTPS schemes. */
export function safeCreativeUrl(raw:string|null|undefined):string|null {
  if(!raw) return null;
  try {const url=new URL(raw);return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&
    (url.hostname.endsWith('.fbcdn.net')||url.hostname.endsWith('.cdninstagram.com'))&&!url.searchParams.has('access_token')?url.toString():null;}catch{return null;}
}
