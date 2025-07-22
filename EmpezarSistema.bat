@echo off
start PHP\php.exe -S localhost:8000
timeout /t 2 /nobreak
start http://localhost:8000
