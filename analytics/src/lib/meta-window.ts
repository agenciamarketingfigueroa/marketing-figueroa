import { shiftDay } from './domain';
import { OPERATION_START } from './operation';
export function nextMetaWindow(today:string,cursor:{phase?:string;historyNext?:string},beginning=OPERATION_START) {
  const recentStart=shiftDay(today,-27)<beginning?beginning:shiftDay(today,-27);
  const historyNext=cursor.historyNext??beginning;
  const history=cursor.phase==='history'&&historyNext<recentStart;
  const start=history?historyNext:recentStart;
  const end=history?(shiftDay(start,6)<recentStart?shiftDay(start,6):shiftDay(recentStart,-1)):today;
  return {start,end,next:{phase:history?'recent':historyNext<recentStart?'history':'recent',historyNext:history?shiftDay(end,1):historyNext}};
}
