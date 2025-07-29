# Face-API.js Models Download Script
Write-Host "Downloading Face-API.js models..." -ForegroundColor Green

$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$modelsDir = "public/models"

# Create models directory if it doesn't exist
if (!(Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Path $modelsDir -Force
}

# List of models to download (using SSD MobileNet like your previous system)
$models = @(
    "ssd_mobilenetv1_model-weights_manifest.json",
    "ssd_mobilenetv1_model-shard1",
    "ssd_mobilenetv1_model-shard2",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2"
)

# Download each model
foreach ($model in $models) {
    $url = "$baseUrl/$model"
    $output = "$modelsDir/$model"
    
    Write-Host "Downloading $model..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -ErrorAction Stop
        Write-Host "✅ Downloaded $model" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to download $model" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nDownload complete! Checking files..." -ForegroundColor Green

# Verify downloads
$downloadedFiles = Get-ChildItem -Path $modelsDir -Name
Write-Host "`nDownloaded files:" -ForegroundColor Cyan
foreach ($file in $downloadedFiles) {
    $size = (Get-Item "$modelsDir/$file").Length
    $sizeKB = [math]::Round($size / 1KB, 2)
    Write-Host "  $file ($sizeKB KB)" -ForegroundColor White
}

$totalSize = (Get-ChildItem -Path $modelsDir | Measure-Object -Property Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "`nTotal size: $totalSizeMB MB" -ForegroundColor Cyan

if ($downloadedFiles.Count -eq 9) {
    Write-Host "`n🎉 All models downloaded successfully!" -ForegroundColor Green
    Write-Host "You can now use face recognition features." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some models may be missing. Expected 9 files, got $($downloadedFiles.Count)" -ForegroundColor Yellow
}
