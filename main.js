const { app, BrowserWindow } = require('electron')
var apps = require('./server');
var debug = require('debug')('infopoint:server');
var https = require('https');
//var AutoLaunch = require('auto-launch');
//var log = require('electron-log');
var fs = require("fs");
function createWindow () {
  // Crea la finestra del browser
  const win = new BrowserWindow({
        width: 400,
        height: 600,
        minWidth: 400,
        minHeight: 600,
        resizable: true,
        center: true,
        autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
    
  })

  app.on('certificate-error', function(event, webContents, url, error, 
    certificate, callback) {
        event.preventDefault();
        callback(true);
  });
 win.setFullScreen(false);
 //win.resizable(false)
  // and load the index.html of the app.
  win.loadURL('https://localhost:8000/')
  
 //win.webContents.openDevTools()
  // Apre il Pannello degli Strumenti di Sviluppo.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Alcune API possono essere utilizzate solo dopo che si verifica questo evento.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // Su macOS è comune che l'applicazione e la barra menù 
  // restano attive finché l'utente non esce espressamente tramite i tasti Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})



app.on('activate', () => {
  // Su macOS è comune ri-creare la finestra dell'app quando
  // viene cliccata l'icona sul dock e non ci sono altre finestre aperte.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. Si può anche mettere il codice in file separati e richiederlo qui.
/**
 * Module dependencies.
 */

/**
 * Get port from environment and store in Express.
 * 
 * 
 */

 


