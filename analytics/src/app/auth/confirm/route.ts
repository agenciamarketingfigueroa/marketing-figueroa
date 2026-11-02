import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/server/supabase';
export async function GET(request:NextRequest) {
  const token_hash = request.nextUrl.searchParams.get('token_hash');const type = request.nextUrl.searchParams.get('type');
  if(token_hash && (type === 'invite' || type === 'recovery')) {
    const {error} = await (await userDb()).auth.verifyOtp({token_hash,type});
    if(!error) return NextResponse.redirect(new URL('/setup-password',request.url));
  }
  return NextResponse.redirect(new URL('/login',request.url));
}
