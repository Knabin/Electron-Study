const { app, BrowserWindow, Menu, Tray } = require('electron')
const path = require('path')

let win;
let tray = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
    let iconPath = path.join(__dirname, '/images/test.png');
    tray = new Tray(iconPath);
    tray.on('double-click', (event, bounds) => {
        win.show();
    });
    
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Normal', type: 'normal', icon: iconPath, click: ()=> {
            win.show();
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
        app.quit()
    }
})

app.setUserTasks([
    {
        program: process.execPath,
        arguments: '--new-window',
        iconPath: process.execPath,
        iconIndex: 0,
        title: 'New Window',
        description: 'Create a new window'
    }
])