const fields = ['spend','gross','net','sales','brlSales','usdGross','usdNet','usdSales','clicks','views','checkouts','purchases','metaRevenue'];
const dailyFields = ['gross','net','sales','brlSales','usdGross','usdNet','usdSales'];

function add(a,b) { return a == null || b == null ? null : a+b; }
function combineRows(rows, keys) {
  const combined = {};
  for (const key of keys) combined[key] = rows.reduce((sum,row) => add(sum,row[key] === undefined ? 0 : row[key]),0);
  return combined;
}
function overlaps(a,b) { return a.start <= b.end && b.start <= a.end; }

export function combineReports(mvave, oficina = null) {
  if (mvave?.client?.id !== 'mvave-br' || !Array.isArray(mvave.weeks) || !mvave.weeks.length) throw new Error('Relatório MVave inválido');
  if (oficina && (oficina.client?.id !== 'oficina-do-violao' || !Array.isArray(oficina.weeks))) throw new Error('Relatório Oficina inválido');
  const inputs = [{name:'Mvave BR',report:mvave},...(oficina?.weeks.length ? [{name:'Oficina do Violão',report:oficina}] : [])];
  const periods = new Map();
  for (const {name,report} of inputs) for (const week of report.weeks) {
    if (!week.start || !week.end || week.id !== week.start || week.days < 1) throw new Error('Período inválido');
    const key = `${week.start}/${week.end}`;
    if (!periods.has(key)) periods.set(key,[]);
    if (periods.get(key).some(item=>item.name===name)) throw new Error('Período duplicado');
    periods.get(key).push({name,week});
  }
  const spans = [...periods.keys()].map(key=>{const [start,end]=key.split('/');return {start,end,key};}).sort((a,b)=>a.start.localeCompare(b.start));
  for (let i=1;i<spans.length;i++) if (overlaps(spans[i-1],spans[i])) throw new Error('Períodos sobrepostos ou desalinhados entre as marcas');
  const weeks = spans.map(({start,end,key})=>{
    const entries = periods.get(key), records = entries.map(item=>item.week);
    if (records.some(week=>week.days !== records[0].days)) throw new Error('Duração do período divergente');
    const byDate = new Map();
    for (const {week} of entries) for (const row of week.daily) {
      if (!byDate.has(row.date)) byDate.set(row.date,[]);
      byDate.get(row.date).push(row);
    }
    const daily = [...byDate].sort(([a],[b])=>a.localeCompare(b)).map(([date,rows])=>({date,...combineRows(rows,dailyFields)}));
    return {
      id:start,start,end,days:records[0].days,
      ...combineRows(records,fields),
      ads:entries.flatMap(({name,week})=>week.ads.map(row=>({...row,name:`${name} · ${row.name}`}))),
      products:entries.flatMap(({name,week})=>week.products.map(row=>({...row,name:`${name} · ${row.name}`}))),
      daily,
      sources:entries.flatMap(({name,week})=>week.sources.map(row=>({...row,name:`${name} · ${row.name}`}))),
      brands:entries.map(item=>item.name)
    };
  });
  return {
    schemaVersion:1,
    client:{id:'operacao',name:'Operação',segment:'Infoprodutos',platforms:['Meta Ads','Hotmart']},
    weeks,
    coverage:inputs.map(({name,report})=>({name,start:report.weeks[0].start,end:report.weeks.at(-1).end})),
    pending:oficina?.weeks.length ? [] : ['Oficina do Violão']
  };
}
