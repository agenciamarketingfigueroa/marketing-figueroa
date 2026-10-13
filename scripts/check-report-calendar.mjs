import assert from 'node:assert/strict';
import {test} from 'node:test';
import {calendarCells,weekForDate} from '../assets/scripts/report-calendar.js';

const weeks=[{id:'2026-09-21',start:'2026-09-21',end:'2026-09-27'},{id:'2026-09-28',start:'2026-09-28',end:'2026-10-04'},{id:'2026-10-05',start:'2026-10-05',end:'2026-10-11'}];

test('a date selects its full reporting week across month boundaries',()=>{
  assert.equal(weekForDate(weeks,'2026-09-28')?.id,'2026-09-28');
  assert.equal(weekForDate(weeks,'2026-10-04')?.id,'2026-09-28');
  assert.equal(weekForDate(weeks,'2026-10-05')?.id,'2026-10-05');
  assert.equal(weekForDate(weeks,'2026-10-11')?.id,'2026-10-05');
  assert.equal(weekForDate(weeks,'2026-10-12'),undefined);
});

test('October calendar includes the final September dates and disables dates without data',()=>{
  const cells=calendarCells('2026-10','2026-08-21','2026-10-11');
  assert.equal(cells[0].date,'2026-09-28');
  assert.equal(cells.find(cell=>cell.date==='2026-10-04')?.available,true);
  assert.equal(cells.find(cell=>cell.date==='2026-10-11')?.available,true);
  assert.equal(cells.find(cell=>cell.date==='2026-10-12')?.available,false);
});
