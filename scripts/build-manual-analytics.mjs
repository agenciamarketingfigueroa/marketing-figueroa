import {build} from '../analytics/node_modules/vite/dist/node/index.js';
import {fileURLToPath} from 'node:url';
const path=p=>fileURLToPath(new URL('../'+p,import.meta.url));
await build({configFile:false,root:path('analytics'),publicDir:false,define:{'process.env.NODE_ENV':'"production"'},resolve:{alias:{
  '@/lib/supabase-browser':path('analytics/manual/supabase.ts'),
  '@/app/session-actions':path('analytics/manual/session.ts'),
  'next/link':path('analytics/manual/link.tsx'),'next/image':path('analytics/manual/image.tsx'),'next/navigation':path('analytics/manual/navigation.ts'),
  '@portal':path('assets/scripts/portal-auth.js'),'@':path('analytics/src'),
}},build:{outDir:path('assets/analytics-runtime'),emptyOutDir:true,lib:{entry:path('analytics/manual/entry.tsx'),formats:['es'],fileName:()=> 'dashboard.js',cssFileName:'dashboard'},minify:true,sourcemap:false}});
