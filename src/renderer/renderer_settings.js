const { ipcRenderer } = require('electron');

document.getElementById('settingsBack').addEventListener('click', () => {
    ipcRenderer.send('close-settings-window');
});