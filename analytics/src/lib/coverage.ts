export interface CoverageWindow { start:number;end:number }
export function mergeCoverage(windows:CoverageWindow[],next:CoverageWindow):CoverageWindow[] {
  const result:CoverageWindow[]=[];
  for(const window of [...windows,next].sort((a,b)=>a.start-b.start)) {
    if(!Number.isFinite(window.start)||!Number.isFinite(window.end)||window.end<window.start) throw new Error('INVALID_COVERAGE');
    const last=result.at(-1);
    if(last&&window.start<=last.end+1) last.end=Math.max(last.end,window.end);
    else result.push({...window});
  }
  return result;
}
export function coversPeriod(windows:CoverageWindow[],start:string,end:string,today:string) {
  const from=Date.parse(`${start}T00:00:00-03:00`);
  // Today is partial, through the most recent completed provider batch.
  const until=Date.parse(`${end}T${end===today?'00:00:00':'23:59:59.999'}-03:00`);
  // Imports can append adjacent days in any order. Validate their union, not
  // whether a single original batch happens to contain the entire selection.
  const merged=windows.reduce<CoverageWindow[]>((result,window)=>mergeCoverage(result,window),[]);
  return merged.some(w=>w.start<=from&&w.end>=until);
}
