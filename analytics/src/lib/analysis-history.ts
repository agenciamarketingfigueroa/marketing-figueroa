export interface AnalysisEntry {
  id:string;createdAt:string;organizationId:string;currency:string;start:string;end:string;
  type:'proposed'|'approved'|'execution-reported';proposalId?:string;target:string;targetKey:string;
  decision:string;reason:string;budget:number|null;evidence?:string;sources:string[];
}
export interface AnalysisActions {load:()=>Promise<AnalysisEntry[]>;append:(entries:AnalysisEntry[])=>Promise<AnalysisEntry[]>;download:()=>Promise<void>}
