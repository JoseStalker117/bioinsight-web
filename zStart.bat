@echo off

set "djangoPath=%~dp0"
set "vitePath=%~dp0\react"

start cmd /k "cd /d "%djangoPath%" && call ./venv/Scripts/activate && python manage.py runserver"
start cmd /k "cd /d "%vitePath%" && npm run dev"