@echo off
echo Installing Drishti AI dependencies...
call npm install

echo Installing Frontend Dependencies...
cd apps\web
call npm install
cd ..\..

echo Installing Backend Dependencies...
pip install -r apps/api/requirements.txt

echo.
echo All dependencies installed!
echo Run "npm run dev" to start the project.
pause
