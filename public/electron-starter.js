const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  TouchBar
} = require("electron");
const { TouchBarButton, TouchBarLabel, TouchBarSpacer } = TouchBar;
const menubarTemplate = require("../src/exports/menubar.js").default;
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: "#daddef",
    show: false,
    titleBarStyle: "customButtonsOnHover",
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    },
    height: 550,
    width: 450,
    maxWidth: 450,
    maxHeight: 550,
    minHeight: 550,
    minWidth: 350
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
