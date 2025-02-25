@echo off

set "djangoPath=%~dp0"
set "vitePath=%~dp0\react"

call "%djangoPath%venv\Scripts\activate.bat"
cd "%djangoPath%"
start cmd /k "python manage.py runserver"
cd "%vitePath%"
start cmd /k "npm install && npm run dev"