let electron = require("electron");
window.remote = electron.remote;
window.ipcRenderer = electron.ipcRenderer;
window.electron = electron;
// https://github.com/electron/electron/issues/9920#issuecomment-336757899
