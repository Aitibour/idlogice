# Open the private connection flow without printing setup credentials.
$netlifyProfile = Get-Content -LiteralPath "$env:APPDATA\netlify\Config\config.json" -Raw | ConvertFrom-Json
$netlifyUser = $netlifyProfile.users.PSObject.Properties[$netlifyProfile.userId].Value
$netlifyHeaders = @{ Authorization = "Bearer $($netlifyUser.auth.token)" }
$siteVariables = Invoke-RestMethod -Uri 'https://api.netlify.com/api/v1/accounts/59026eb6cf321c7359e9f482/env?site_id=613f23ed-2a89-4a10-9e55-2142f29d7461' -Headers $netlifyHeaders
$setupVariable = $siteVariables | Where-Object { $_.key -eq 'SOCIAL_AUTOMATION_SECRET' }
$setupValue = ($setupVariable.values | Where-Object { $_.context -eq 'all' } | Select-Object -First 1).value
if (-not $setupValue) { throw 'The private LinkedIn setup credential is missing.' }
$connectAddress = 'https://idlogice.com/api/linkedin/connect?key=' + [uri]::EscapeDataString($setupValue)
Start-Process $connectAddress
Write-Output 'LinkedIn authorization opened in your browser. Sign in as the IDLOGICE page administrator and review the requested permissions.'
