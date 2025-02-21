@echo off

set "djangoPath=%~dp0"
set "vitePath=%~dp0\react"

start powershell -NoExit -Command "cd '%djangoPath%' ; .\venv\Scripts\Activate.ps1 ; python manage.py runserver"
start powershell -NoExit -Command "cd '%vitePath%' ; npm install ; npm run dev"