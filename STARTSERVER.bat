set OLDDIR=%CD%

node app.js
IF ERRORLEVEL 1 node C:\rc\rainingchain\app.js
IF ERRORLEVEL 1 cd C:\Program Files (x86)\nodejs && node.exe C:\rc\rainingchain\app.js
IF ERRORLEVEL 1 cd C:\Program Files\nodejs && node.exe C:\rc\rainingchain\app.js

IF ERRORLEVEL 1 cd C:\Program Files (x86)\nodejs && node.exe %OLDDIR%\app.js
IF ERRORLEVEL 1 cd C:\Program Files\nodejs && node.exe %OLDDIR%\app.js
PAUSE