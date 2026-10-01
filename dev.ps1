#requires -Version 5.1
<#
.SYNOPSIS
  Local Docker lifecycle for Exaltavit (https://dev.exaltavit.com).
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Command = 'help',
    [Parameter(Position = 1)]
    [string]$Service
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$HostName = 'dev.exaltavit.com'
$BindIp = if ($env:EXALTAVIT_BIND_IP) { $env:EXALTAVIT_BIND_IP } else { '127.0.0.3' }
$HostsFile = Join-Path $env:SystemRoot 'System32\drivers\etc\hosts'
$CertFile = Join-Path $PSScriptRoot "certs\$HostName.pem"
$KeyFile = Join-Path $PSScriptRoot "certs\$HostName-key.pem"
$Url = "https://$HostName/"

function Invoke-Compose {
    docker compose @args
    if ($LASTEXITCODE -ne 0) { throw "docker compose $($args -join ' ') failed ($LASTEXITCODE)" }
}

function Initialize-Certs {
    if ((Test-Path $CertFile) -and (Test-Path $KeyFile)) { return }
    if (-not (Get-Command mkcert -ErrorAction SilentlyContinue)) {
        throw 'mkcert not found. Install it (scoop install mkcert) and rerun setup.'
    }
    mkcert -install
    mkcert -key-file $KeyFile -cert-file $CertFile $HostName localhost 127.0.0.1 $BindIp
}

function Initialize-HostsEntry {
    $wanted = "$BindIp  $HostName"
    $pattern = '^\s*#?\s*\d+\.\d+\.\d+\.\d+\s+' + [regex]::Escape($HostName) + '\s*$'
    $lines = @(Get-Content $HostsFile)
    if ($lines -contains $wanted) { return }

    Write-Host "Updating hosts file: $wanted (UAC prompt)"
    $script = @"
`$h = '$HostsFile'
`$lines = @(Get-Content `$h | Where-Object { `$_ -notmatch '$pattern' })
`$lines += '$wanted'
Set-Content -Path `$h -Value `$lines -Encoding ascii
ipconfig /flushdns | Out-Null
"@
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($script))
    Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile', '-EncodedCommand', $encoded
    if (@(Get-Content $HostsFile) -notcontains $wanted) { throw 'Hosts file was not updated.' }
}

switch ($Command.ToLowerInvariant()) {
    'setup' {
        Initialize-Certs
        Initialize-HostsEntry
        Invoke-Compose up -d
        Write-Host "Ready: $Url"
    }
    'start' {
        if (-not (Test-Path $CertFile)) { throw 'Certs missing. Run .\dev.ps1 setup first.' }
        Invoke-Compose up -d
        Write-Host "Running: $Url"
    }
    'stop' { Invoke-Compose down }
    'restart' { Invoke-Compose restart }
    'status' { Invoke-Compose ps }
    'logs' {
        if ($Service) { Invoke-Compose logs -f --tail 100 $Service } else { Invoke-Compose logs -f --tail 100 }
    }
    'build' {
        Invoke-Compose run --rm --no-deps web sh -c 'cmp -s package-lock.json node_modules/.lock-stamp || { npm ci && cp package-lock.json node_modules/.lock-stamp; }; npm run build'
    }
    default {
        @"
Usage: .\dev.ps1 <command>

  setup     One-time: mkcert certs, hosts entry ($BindIp $HostName), start stack
  start     Start the stack ($Url)
  stop      Stop and remove containers
  restart   Restart containers
  status    Show container status
  logs      Follow logs (optionally: logs web | logs gateway)
  build     Production build (tsc + vite build) inside the container
"@ | Write-Host
    }
}
