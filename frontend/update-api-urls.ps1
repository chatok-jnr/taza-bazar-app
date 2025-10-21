# Script to update all API URLs from localhost to use the centralized config

$files = @(
    "src/pages/ConsumerDashboard.jsx",
    "src/pages/ConsumerMarketplace.jsx",
    "src/pages/ConsumerProfile.jsx",
    "src/pages/ConsumerRequests.jsx",
    "src/pages/FarmerDashboard.jsx",
    "src/pages/FarmerListing.jsx",
    "src/pages/FarmerMarketplace.jsx",
    "src/pages/FarmerProfile.jsx",
    "src/components/ProductDetailsModal.jsx"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    if (Test-Path $filePath) {
        Write-Host "Processing $file..."
        $content = Get-Content $filePath -Raw
        
        # Replace the old URL with the new getApiUrl function
        $content = $content -replace 'http://127\.0\.0\.1:8000/', ''
        $content = $content -replace "fetch\(`([^`]+)`", "fetch(getApiUrl(`$1`)"
        $content = $content -replace 'fetch\("([^"]+)"', 'fetch(getApiUrl("$1")'
        $content = $content -replace "fetch\('([^']+)'", "fetch(getApiUrl('`$1')"
        
        Set-Content $filePath $content -NoNewline
        Write-Host "Updated $file"
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nAll files updated successfully!" -ForegroundColor Green
