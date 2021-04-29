const { app, BrowserWindow, Menu, Tray, BrowserView } = require('electron')
const path = require('path')
const log = require('electron-log')

let mainWindow;
let webView;
let tray = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        backgroundColor: '#151515',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    webView = new BrowserView();
    mainWindow.setBrowserView(webView);
    webView.setBounds({x: 280, y: 70, width: 800 - 280, height: 600 - 70});
    webView.setAutoResize({width: true, height: true});
    webView.webContents.loadURL("https://www.electronjs.org");
    log.info('main.js loaded');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
    let iconPath = path.join(__dirname, '/images/test.png');
    tray = new Tray(iconPath);
    tray.on('double-click', (event, bounds) => {
        mainWindow.show();
    });
    
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Normal', type: 'normal', icon: iconPath, click: ()=> {
            mainWindow.show();
        }},
        { label: 'Separator', type: 'separator' },
        { label: 'Checkbox', type: 'checkbox' },
        { label: 'Radio', type: 'radio' },
    ])
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// app.setUserTasks([
//     {
//         program: process.execPath,
//         arguments: '--new-window',
//         iconPath: process.execPath,
//         iconIndex: 0,
//         title: 'New Window',
//         description: 'Create a new window'
//     }
// ])