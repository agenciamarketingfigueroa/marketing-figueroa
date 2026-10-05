export const monthKey = date => date.slice(0,7);

export function weekForDate(weeks,date) {
  return weeks.find(week=>week.start<=date&&date<=week.end);
}

export function calendarCells(month,minDate,maxDate) {
  const [year,number]=month.split('-').map(Number);
  const first=new Date(Date.UTC(year,number-1,1));
  const offset=(first.getUTCDay()+6)%7;
  const days=new Date(Date.UTC(year,number,0)).getUTCDate();
  const length=Math.ceil((offset+days)/7)*7;
  return Array.from({length},(_,index)=>{
    const day=new Date(Date.UTC(year,number-1,index-offset+1));
    const date=day.toISOString().slice(0,10);
    return {date,day:day.getUTCDate(),inMonth:monthKey(date)===month,available:minDate<=date&&date<=maxDate};
  });
}

export const monthTitle = month => new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${month}-01T00:00:00Z`));
