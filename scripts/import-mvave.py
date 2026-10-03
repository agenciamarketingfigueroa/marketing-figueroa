"""Read source exports without changing them. Only aggregate, non-personal data is emitted."""
import json
import sys
import re
import hashlib
from datetime import datetime, timedelta
from decimal import Decimal
from collections import Counter
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def rows(path):
    with zipfile.ZipFile(path) as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml'))]
        root = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        result = []
        for row in root.findall('.//s:sheetData/s:row', NS):
            values = {}
            for cell in row:
                col = ''.join(c for c in cell.attrib['r'] if c.isalpha())
                v = cell.find('s:v', NS)
                value = v.text if v is not None else ''
                if cell.attrib.get('t') == 's':
                    value = strings[int(value)]
                elif cell.attrib.get('t') == 'inlineStr':
                    value = ''.join(cell.find('s:is', NS).itertext())
                values[col] = value
            result.append(values)
        return result

def money(value):
    return int((Decimal(value or '0') * 100).quantize(Decimal('1')))

def import_report(directory):
    weeks = []
    transactions = set()
    for path in directory.glob('Ads (*.xlsx'):
        data = rows(path)
        header = data[0]
        assert header['G'] == 'Valor gasto (BRL)' and header['U'] == 'Compras'
        records = data[1:]
        start, end = records[0]['A'], records[0]['B']
        dates = re.findall(r'\d{2}-\d{2}', path.name)
        hotmart = next(p for p in directory.glob('Hotmart*.xls') if all(d in p.name for d in dates))
        sales = rows(hotmart)
        legacy = sales[0]['A'] == 'Nome do Produto'
        week = dict(id=start, start=start, end=end, days=(datetime.fromisoformat(end)-datetime.fromisoformat(start)).days+1,
                    spend=0, clicks=0, views=0, checkouts=0, purchases=0, metaRevenue=0,
                    gross=0, net=0, sales=0, brlSales=0, usdGross=0, usdNet=0, usdSales=0,
                    ads=[], products=[], daily=[], sources=[], statuses=dict(Counter(r.get('S' if legacy else 'B') for r in sales[1:])))
        for source in [path, hotmart]:
            week['sources'].append({'name':source.name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(), 'rows':len(rows(source))-1})
        ads = {}
        for r in records:
            assert r['A'] == start and r['B'] == end and r.get('C'), 'Invalid ad period or total row'
            name = r['C']
            ad = ads.setdefault(name,dict(name=name,spend=0,clicks=0,views=0,checkouts=0,purchases=0,metaRevenue=0))
            for key, col in [('spend','G'),('clicks','L'),('views','N'),('checkouts','Q'),('purchases','U'),('metaRevenue','W')]:
                value = money(r.get(col)) if key in ('spend','metaRevenue') else int(Decimal(r.get(col) or '0'))
                ad[key] += value
                week[key] += value
        week['ads'] = list(ads.values())
        products, daily = {}, {}
        for offset in range(week['days']):
            day = (datetime.fromisoformat(start)+timedelta(days=offset)).date().isoformat()
            daily[day] = dict(date=day,gross=0,net=0,sales=0,brlSales=0,usdGross=0,usdNet=0,usdSales=0)
        for r in sales[1:]:
            status = r['S' if legacy else 'B']
            assert status in ('Completo','Aprovado'), 'Review transaction status before import'
            tx = r['E' if legacy else 'A']
            assert tx not in transactions, 'Duplicate transaction'
            transactions.add(tx)
            date = datetime.strptime(r['Q' if legacy else 'C'], '%d/%m/%Y %H:%M:%S').date().isoformat()
            assert start <= date <= end, 'Sale outside export period'
            currency = r['J' if legacy else 'P']
            assert currency in ('BRL','USD')
            assert r['AO' if legacy else 'S'] == 'Produtor'
            if legacy:
                assert r['H'] == 'BRL' and r['AT'] == '1', 'Review legacy currency / quantity'
                gross, net = money(r['I']), money(r['BD'])
            else:
                gross, net = money(r['Q']), money(r['R'])
            name = r['A' if legacy else 'G']
            product = products.setdefault(name,dict(name=name,gross=0,net=0,sales=0,brlSales=0,usdGross=0,usdNet=0,usdSales=0))
            for obj in [week, product, daily[date]]:
                obj['sales'] += 1
                obj['gross' if currency == 'BRL' else 'usdGross'] += gross
                obj['net' if currency == 'BRL' else 'usdNet'] += net
                obj['brlSales' if currency == 'BRL' else 'usdSales'] += 1
        week['products'], week['daily'] = list(products.values()), list(daily.values())
        assert sum(p['gross'] for p in week['products']) == week['gross']
        assert sum(d['net'] for d in week['daily']) == week['net']
        weeks.append(week)
    weeks.sort(key=lambda w:w['start'])
    assert len(weeks) == 6
    for previous, current in zip(weeks,weeks[1:]):
        assert (datetime.fromisoformat(current['start'])-datetime.fromisoformat(previous['end'])).days == 1
    return dict(schemaVersion=1, client=dict(id='mvave-br',name='Mvave BR',segment='Infoprodutos',platforms=['Meta Ads','Hotmart']), weeks=weeks)

if __name__ == '__main__':
    report = import_report(Path(sys.argv[1]))
    if len(sys.argv) > 2:
        Path(sys.argv[2]).write_text(json.dumps(report,ensure_ascii=False),encoding='utf-8')
    print(json.dumps([{k:w[k] for k in ['start','days','spend','gross','net','sales','usdGross','usdNet','usdSales','purchases']} for w in report['weeks']],ensure_ascii=False))
