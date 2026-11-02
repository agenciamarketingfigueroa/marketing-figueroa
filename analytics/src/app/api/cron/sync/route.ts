import { NextRequest,NextResponse } from 'next/server';
import { secretMatches,errorCode } from '@/lib/server/http';
import { syncProvider } from '@/lib/server/sync';
export const runtime='nodejs';
export const maxDuration=180;
export async function POST(request:NextRequest) {
  const secret=process.env.CRON_SECRET;
  if(!secret || secret.length<32) return NextResponse.json({error:'NOT_CONFIGURED'},{status:503});
  if(!secretMatches(request.headers.get('authorization'),`Bearer ${secret}`)) return NextResponse.json({error:'UNAUTHORIZED'},{status:401});
  const provider=request.nextUrl.searchParams.get('provider');
  if(provider!=='meta' && provider!=='hotmart' && provider!=='instagram') return NextResponse.json({error:'INVALID_PROVIDER'},{status:400});
  try {return NextResponse.json(await syncProvider(provider));}
  catch(error) {return NextResponse.json({error:errorCode(error)},{status:503});}
}
