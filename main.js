const { app, BrowserWindow } = require('electron');
const path = require('path')


let libs = [
  require("electron-rebuild"),
  require("better-sqlite3"),
  require("convert-csv-to-array"),
  require("quick.db")
]

function createWindow() {
  // Create the browser window
  let mainWindow = new BrowserWindow({
    width: 1024,
    height: 786,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  // Load your HTML file
  mainWindow.loadFile('views/index.html');

  // Open the DevTools (optional)
  // mainWindow.webContents.openDevTools();

  // Event handler for when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Execute the createWindow function when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, quit the app only if the user explicitly closes it
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create the window when the dock icon is clicked and there are no other windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
