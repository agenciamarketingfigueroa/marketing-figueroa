import type {ImgHTMLAttributes} from 'react';
export default function Image({src,alt='',priority,unoptimized,...props}:ImgHTMLAttributes<HTMLImageElement>&{priority?:boolean;unoptimized?:boolean}) {
  void unoptimized;
  // Static Pages and Go Live do not have the Next image optimization endpoint.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt} src={src==='/brand.svg'?'analytics/public/brand.svg':src} loading={priority?'eager':'lazy'}/>;
}
