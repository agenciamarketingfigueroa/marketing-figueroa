import { NextRequest,NextResponse } from 'next/server';
import { requireAccess,AccessError } from '@/lib/server/auth';
import { safeCreativeUrl } from '@/lib/media';
export const runtime='nodejs';
export async function GET(request:NextRequest) {
  try {
    const access=await requireAccess(request.nextUrl.searchParams.get('organization')||undefined);
    const account=request.nextUrl.searchParams.get('account');const ad=request.nextUrl.searchParams.get('ad');
    if(!account||!ad||!/^\d+$/.test(account)||!/^\d+$/.test(ad)) return new NextResponse(null,{status:400});
    const result=await access.db.from('ad_creatives').select('image_url').eq('organization_id',access.organizationId).eq('account_id',account).eq('ad_id',ad).single();
    const url=safeCreativeUrl(result.data?.image_url);if(result.error||!url) return new NextResponse(null,{status:404});
    const response=await fetch(url,{redirect:'error',cache:'no-store',signal:AbortSignal.timeout(10000)});
    const type=response.headers.get('content-type')?.split(';')[0];
    const maxBytes=5*1024*1024;
    if(!response.ok||!type||!['image/jpeg','image/png','image/webp','image/gif'].includes(type)||Number(response.headers.get('content-length'))>maxBytes||!response.body) return new NextResponse(null,{status:502});
    const reader=response.body.getReader();const chunks:Uint8Array[]=[];let size=0;
    try {while(true) {const {done,value}=await reader.read();if(done) break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();return new NextResponse(null,{status:502});}chunks.push(value);}}finally{reader.releaseLock();}
    return new NextResponse(Buffer.concat(chunks),{headers:{'Content-Type':type,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
  } catch(error) {return new NextResponse(null,{status:error instanceof AccessError?error.status:502});}
}
