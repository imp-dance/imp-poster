const electron = require("electron");
const { app, BrowserWindow, shell, ipcMain, Menu, TouchBar } = electron;
const { TouchBarButton, TouchBarLabel, TouchBarSpacer } = TouchBar;
const path = require("path");
const menubarTemplate = require(path.join(__dirname, "menubar.js")).default;
const isDev = require("electron-is-dev");

let mainWindow;

createWindow = () => {
  let definedHeight = 480;
  let definedWidth = 425;
  let display = electron.screen.getPrimaryDisplay();
  let displayWidth = display.bounds.width;
  mainWindow = new BrowserWindow({
    backgroundColor: "#daddef",
    show: false,
    titleBarStyle: "customButtonsOnHover",
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    },
    height: definedHeight,
    maxHeight: definedHeight,
    minHeight: definedHeight,
    width: definedWidth,
    maxWidth: definedWidth,
    minWidth: definedWidth,
    x: displayWidth - definedWidth,
    y: 0
  });
  mainWindow.hide();
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require("electron-devtools-installer");

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });

    installExtension(REDUX_DEVTOOLS)
      .then(name => {
        console.log(`Added Extension: ${name}`);
      })
      .catch(err => {
        console.log("An error occurred: ", err);
      });
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    ipcMain.on("open-external-window", (event, arg) => {
      shell.openExternal(arg);
    });
  });
};

generateMenu = () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menubarTemplate()));
};

app.on("ready", () => {
  createWindow();
  generateMenu();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("load-page", (event, arg) => {
  mainWindow.loadURL(arg);
});
