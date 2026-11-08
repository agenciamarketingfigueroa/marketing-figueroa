"""Optional BIFF reader: python -m pip install xlrd==2.0.2. No extension renaming."""
import sys, json, xlrd
book = xlrd.open_workbook(sys.argv[1])
sheet = book.sheet_by_index(0)
def column(n):
    s = ''
    while n:
        n, r = divmod(n-1, 26)
        s = chr(65+r)+s
    return s
rows = []
for row in sheet:
    out = {}
    for i, cell in enumerate(row):
        key = column(i+1)
        value = cell.value
        if cell.ctype == xlrd.XL_CELL_DATE:
            value = xlrd.xldate_as_datetime(value, book.datemode).strftime('%d/%m/%Y %H:%M:%S')
        elif cell.ctype == xlrd.XL_CELL_NUMBER and value.is_integer():
            value = str(int(value))
        out[key] = str(value)
        out[key+'__type'] = 's' if cell.ctype == xlrd.XL_CELL_TEXT else 'n'
    rows.append(out)
print(json.dumps(rows, ensure_ascii=True))
