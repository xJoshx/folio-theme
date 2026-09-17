param([string]$Name = "PowerShell")

$result = [ordered]@{ name = $Name; healthy = $true }
$result | ConvertTo-Json -Depth 2
