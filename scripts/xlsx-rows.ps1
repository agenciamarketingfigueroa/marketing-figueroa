param([Parameter(Mandatory=$true)][string]$Path)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead($Path)
try {
  $shared = @()
  $entry = $archive.GetEntry('xl/sharedStrings.xml')
  if ($entry) {
    $stream = $entry.Open()
    try { $reader = [System.IO.StreamReader]::new($stream); try { [xml]$doc = $reader.ReadToEnd() } finally { $reader.Dispose() } } finally { $stream.Dispose() }
    $ns = [System.Xml.XmlNamespaceManager]::new($doc.NameTable)
    $ns.AddNamespace('s','http://schemas.openxmlformats.org/spreadsheetml/2006/main')
    foreach ($si in $doc.SelectNodes('//s:si',$ns)) { $shared += ($si.SelectNodes('.//s:t',$ns) | ForEach-Object { $_.InnerText }) -join '' }
  }
  $entry = $archive.GetEntry('xl/worksheets/sheet1.xml')
  if (-not $entry) { throw 'Planilha 1 ausente' }
  $stream = $entry.Open()
  try { $reader = [System.IO.StreamReader]::new($stream); try { [xml]$doc = $reader.ReadToEnd() } finally { $reader.Dispose() } } finally { $stream.Dispose() }
  $ns = [System.Xml.XmlNamespaceManager]::new($doc.NameTable)
  $ns.AddNamespace('s','http://schemas.openxmlformats.org/spreadsheetml/2006/main')
  $rows = @()
  foreach ($row in $doc.SelectNodes('//s:sheetData/s:row',$ns)) {
    $values = @{}
    foreach ($cell in $row.SelectNodes('./s:c',$ns)) {
      $col = $cell.GetAttribute('r') -replace '\d',''
      $value = $cell.SelectSingleNode('./s:v',$ns)
      $text = if ($value) { $value.InnerText } else { '' }
      if ($cell.GetAttribute('t') -eq 's') { $text = $shared[[int]$text] }
      if ($cell.GetAttribute('t') -eq 'inlineStr') { $text = ($cell.SelectNodes('.//s:t',$ns) | ForEach-Object { $_.InnerText }) -join '' }
      $values[$col] = $text
    }
    $rows += $values
  }
  ConvertTo-Json -InputObject $rows -Depth 5 -Compress
} finally { $archive.Dispose() }
