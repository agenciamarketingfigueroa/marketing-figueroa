import type { Metadata } from 'next';
import './globals.css';
import './performance.css';
export const metadata: Metadata = {title:'Analytics · Marketing Figueroa',description:'Análise privada de mídia e vendas da operação Mvave BR.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
