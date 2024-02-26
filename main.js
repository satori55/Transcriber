// main.js
const { app, BrowserWindow, BrowserView, ipcMain, dialog, Menu } = require('electron');
const { PythonShell } = require('python-shell');
const path = require('path');

Menu.setApplicationMenu(null);

let win;
let settingsView;

let viewWidth = 600;
let viewHeight = 400;

//model selection from dropdown
//default model
let model_name = 'base';
let task_name = 'transcribe';

ipcMain.on('dropdown-value', (event, selectedValue) => {
    model_name = selectedValue;
});

// open file dialog
ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            // audio file path
            const selectedFilePath = result.filePaths[0];
            //   console.log('Selected File:', selectedFilePath);
            event.sender.send('file-selected');

            // Python script
            if (selectedFilePath) {
                // console.log('Selected File:', selectedFilePath);
                PythonShell.run('./src/py/transcribe.py', { args: [selectedFilePath, model_name, task_name] }).then(messages => {
                    // console.log('Transcription Result:', messages[0]);
                    // send to renderer
                    event.sender.send('transcription-result', messages.join('\n'));
                }).catch(err => {
                    // It's also good practice to catch any errors
                    console.error('Error:', err);
                });
            }
        }
    }).catch(err => {
        console.log(err);
    });
});

// open settings window
ipcMain.on('open-settings-window', (event) => {
    let viewX = Math.round((win.getContentBounds().width - viewWidth) / 2);
    let viewY = Math.round((win.getContentBounds().height - viewHeight) / 2);

    settingsView = new BrowserView({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.addBrowserView(settingsView);
    settingsView.setBounds({ x: viewX, y: viewY, width: viewWidth, height: viewHeight });
    settingsView.webContents.loadFile(path.join(__dirname, 'src/renderer/settings.html'));
});

// close settings window
ipcMain.on('close-settings-window', (event) => {
    win.removeBrowserView(settingsView);
    win.webContents.send('close-settings-window');
});

// create index window
function createWindow() {
    // browser window options
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 650,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.setMenu(null);
    // load index.html
    win.loadFile(path.join(__dirname, 'src/renderer/index.html'));

    // Resize settingsView with window
    win.on('resize', () => {
        if (settingsView) {
            let viewX = Math.round((win.getContentBounds().width - viewWidth) / 2);
            let viewY = Math.round((win.getContentBounds().height - viewHeight) / 2);
            console.log(viewX, viewY, viewWidth, viewHeight, win.getContentBounds().width, win.getContentBounds().height);
            settingsView.setBounds({ x: viewX, y: viewY, width: viewWidth, height: viewHeight });
        }
    });

}

app.whenReady().then(createWindow);

// Windows & Linux
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

//Mac
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
