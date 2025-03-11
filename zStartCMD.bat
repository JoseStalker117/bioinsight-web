@echo off

set "djangoPath=%~dp0"
set "vitePath=%~dp0\react"
set "venvPath=%djangoPath%venv"

REM Verifica si el entorno virtual 'venv' ya existe
if not exist "%venvPath%" (
    echo Creando entorno virtual...
    python -m venv "%venvPath%"
)

REM Activa el entorno virtual 'venv'
call "%venvPath%\Scripts\activate.bat"

REM Instala los requerimientos 'requirements.txt'
if exist "%djangoPath%requirements.txt" (
    echo Instalando requerimientos...
    pip install -r "%djangoPath%requirements.txt"
)
REM Abre las consolas de 'Django' y 'Vite+React'
cd "%djangoPath%"
start cmd /k "python manage.py runserver"
cd "%vitePath%"
start cmd /k "npm install && npm run dev"