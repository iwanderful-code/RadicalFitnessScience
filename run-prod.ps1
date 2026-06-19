$env:PATH = "C:\Users\samue\Documents\antigravity\radiant-bell\node-v20.11.1-win-x64;" + $env:PATH
.\node-v20.11.1-win-x64\npm.cmd run build
$env:NODE_ENV = "production"
.\node-v20.11.1-win-x64\npm.cmd start
