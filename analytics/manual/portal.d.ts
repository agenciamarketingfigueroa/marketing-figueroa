declare module '@portal' {
  export interface Session {role:string;expires:number;analyticsKey?:string}
  export function session():Session|null;
  export function logout():void;
  export function bindLogin(callback:(session:Session)=>Promise<void>,options:{requiredRole:string}):void;
}
