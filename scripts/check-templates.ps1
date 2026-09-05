# Check WhatsApp message-template approval status from Meta.
# Reads the access token from Firebase Secret Manager (never prints it) and
# lists every template with its status. Usage:  pwsh ./scripts/check-templates.ps1
# Requires: a valid `firebase login` and the summit-automates project.

$ErrorActionPreference = "Stop"
$WABA = "2583097728809080"

# Pull the token from Secret Manager; isolate the token line (starts with EAA)
# so any CLI log/notice lines are discarded. The value is never echoed.
$raw = firebase apphosting:secrets:access whatsapp-access-token --project summit-automates 2>$null | Out-String
$lines = $raw -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
$tok = ($lines | Where-Object { $_ -match '^EAA' } | Select-Object -First 1)
if (-not $tok) {
  Write-Host "Could not read the WhatsApp access token." -ForegroundColor Red
  Write-Host "Run 'firebase login --reauth' and try again." -ForegroundColor Yellow
  exit 1
}

$uri = "https://graph.facebook.com/v21.0/$WABA/message_templates?fields=name,status,category,language,rejected_reason&limit=200"
try {
  $resp = Invoke-RestMethod -Method Get -Uri $uri -Headers @{ Authorization = "Bearer $tok" } -ErrorAction Stop
} catch {
  Write-Host "Graph API error:" -ForegroundColor Red
  if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message } else { Write-Host $_.Exception.Message }
  exit 1
}
finally { $tok = $null }

$data = $resp.data
Write-Host ""
Write-Host ("Templates on WABA $WABA : {0} total" -f $data.Count) -ForegroundColor Cyan
$byStatus = $data | Group-Object status | Sort-Object Name
foreach ($g in $byStatus) { Write-Host ("  {0,-10} {1}" -f $g.Name, $g.Count) }
Write-Host ""
$data |
  Select-Object name, status, category, language, rejected_reason |
  Sort-Object status, name |
  Format-Table -AutoSize | Out-String -Width 200 | Write-Host
