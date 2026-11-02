import { notFound } from 'next/navigation';
import { Dashboard } from '@/components/dashboard';
import { demoDataset } from '@/lib/demo';
export const dynamic = 'force-dynamic';
export default function Demo() {
  if(process.env.ENABLE_DEMO !== 'true' && process.env.NODE_ENV !== 'development') notFound();
  return <Dashboard initialData={demoDataset()} initialStart="2026-08-21" initialEnd="2026-11-01"/>;
}
