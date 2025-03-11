# Set paths
$djangoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$vitePath = Join-Path $djangoPath "react"
$venvPath = Join-Path $djangoPath "venv"

# Check if the virtual environment 'venv' exists
if (-Not (Test-Path $venvPath)) {
    Write-Host "Creating virtual environment..."
    python -m venv $venvPath
}

# Activate the virtual environment 'venv'
& "$venvPath\Scripts\Activate.ps1"

# Install requirements from 'requirements.txt'
$requirementsPath = Join-Path $djangoPath "requirements.txt"
if (Test-Path $requirementsPath) {
    Write-Host "Installing requirements..."
    pip install -r $requirementsPath
}

# Open Django and Vite+React in separate windows
Start-Process powershell -ArgumentList "cd `"$djangoPath`"; python manage.py runserver"
Start-Process powershell -ArgumentList "cd `"$vitePath`"; npm install; npm run dev"