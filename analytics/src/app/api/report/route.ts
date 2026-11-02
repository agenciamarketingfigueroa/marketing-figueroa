import { NextRequest,NextResponse } from 'next/server';
import { requireAccess,AccessError } from '@/lib/server/auth';
import { loadReport,periodSchema } from '@/lib/server/report';
export async function GET(request:NextRequest) {
  try {
    const access=await requireAccess(request.nextUrl.searchParams.get('organization') || undefined);
    const period=periodSchema.safeParse({start:request.nextUrl.searchParams.get('start'),end:request.nextUrl.searchParams.get('end')});
    if(!period.success) return NextResponse.json({error:'Escolha um período válido dentro do limite de 10 anos.'},{status:400});
    return NextResponse.json(await loadReport(access,period.data.start,period.data.end),{headers:{'Cache-Control':'private, no-store'}});
  } catch(error) {
    return NextResponse.json({error:error instanceof AccessError ? error.code : 'REPORT_UNAVAILABLE'},{status:error instanceof AccessError ? error.status : 503});
  }
}
