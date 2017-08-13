const path = require('path');
// const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

/**
 * Include our app
 */
const {app, BrowserWindow, protocol } = require('electron');

const APP_PROTO = 'app';
const RES_PROTO = 'res';

// browser-window creates a native window
let mainWindow = null;

function getApplicationIcon() {
  let location =  '../assets/images/logo.png';
  return path.join(__dirname, location);
}

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const dir = (url) => path.normalize(`${__dirname}/${url}`)

const createWindow = () => {

  // installExtension(REDUX_DEVTOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log('An error occurred: ', err));

  // Initialize the window to our specified dimensions
  mainWindow = new BrowserWindow({
    width: 600,
    height: 123,
    frame: false,
    icon: getApplicationIcon(),
    resizable: false
  });

  // Tell Electron where to load the entry point from
  mainWindow.loadURL(dir('index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Clear out the main window when the app is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
