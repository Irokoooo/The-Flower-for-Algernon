$ErrorActionPreference = 'Stop'
# Anchor to this script, regardless of the terminal's current directory.
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
$pythonPath = if ($pythonCommand) { $pythonCommand.Source } else { Join-Path $env:LOCALAPPDATA 'Programs\Python\Python311\python.exe' }
if (-not (Test-Path -LiteralPath $pythonPath)) { throw 'Python 3 is required to serve the dashboard.' }
Write-Host 'Dashboard: http://127.0.0.1:4174/project-status.html (Ctrl+C to stop)'
& $pythonPath -m http.server 4174 --bind 127.0.0.1 --directory $PSScriptRoot
