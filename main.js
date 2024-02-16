// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { PythonShell } = require('python-shell');




//default model
let model_name = 'base';
//model selection from dropdown
ipcMain.on('dropdown-value', (event, selectedValue) => {
    model_name = selectedValue;
});

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }).then(result => {
        if (!result.canceled) {
            // audio file path
            const selectedFilePath = result.filePaths[0];
            //   console.log('Selected File:', selectedFilePath);

            // Python script
            if (selectedFilePath) {
                // console.log('Selected File:', selectedFilePath);
                PythonShell.run('./src/py/transcribe.py', { args: [selectedFilePath, model_name] }).then(messages => {
                    // console.log('Transcription Result:', messages[0]);
                    // send to renderer
                    event.sender.send('transcription-result', messages.join('\n'));
                }).catch(err => {
                    // It's also good practice to catch any errors
                    console.error('Error:', err);
                });
            };
        }
    }).catch(err => {
        console.log(err);
    });
});


function createWindow() {
    // browser window options
    let win = new BrowserWindow({
        width: 800,
        height: 400,
        // frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.setMenu(null);
    // load index.html
    win.loadFile('src/renderer/index.html');
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
