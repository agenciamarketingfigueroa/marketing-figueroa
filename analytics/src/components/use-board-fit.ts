'use client';
import {useEffect,useRef} from 'react';

/** Keep every slide inside the monitor; mobile retains its normal readable flow. */
export function useBoardFit(slide:number) {
  const frame=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const viewport=frame.current,canvas=stage.current;
    if(!viewport||!canvas)return;
    const media=window.matchMedia('(min-width: 900px)');let raf=0;let disposed=false;
    const fit=()=>{
      if(disposed)return;
      if(!media.matches){canvas.style.width='';canvas.style.transform='';canvas.style.left='';return;}
      const width=viewport.clientWidth,height=viewport.clientHeight;
      if(!width||!height)return;
      const naturalWidth=Math.max(1100,width);canvas.style.width=naturalWidth+'px';
      const active=canvas.querySelector<HTMLElement>('.is-active');
      if(!active)return;
      const naturalHeight=Math.max(active.offsetHeight,active.scrollHeight)+18;
      const scale=Math.min(1,width/naturalWidth,height/Math.max(1,naturalHeight));
      canvas.style.transform=`scale(${scale})`;canvas.style.left=`${Math.max(0,(width-naturalWidth*scale)/2)}px`;
    };
    const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(fit);};
    const observer=new ResizeObserver(schedule);observer.observe(viewport);
    const active=canvas.querySelector('.is-active');if(active)observer.observe(active);
    media.addEventListener('change',schedule);window.addEventListener('resize',schedule);
    void document.fonts?.ready.then(schedule);schedule();
    return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();media.removeEventListener('change',schedule);window.removeEventListener('resize',schedule);};
  },[slide]);
  return {frame,stage};
}
