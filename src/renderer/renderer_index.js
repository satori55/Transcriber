// renderer.js
const { ipcRenderer } = require('electron');

// Button click event of transcribeButton
document.getElementById('transcribeButton').addEventListener('click', () => {
    ipcRenderer.send('open-file-dialog');
});

// Button click event of settingsButton
document.getElementById('settingsButton').addEventListener('click', () => {
    showSettings();
    ipcRenderer.send('open-settings-window');
});

ipcRenderer.on('close-settings-window', (event) => {
    closeSettings();
});

// text send back
ipcRenderer.on('transcription-result', (event, data) => {
    // show transcription result
    document.getElementById('transcriptionResult').textContent = data;
});

ipcRenderer.on('transcription-error', (event, error) => {
    // error
    document.getElementById('transcriptionResult').textContent = `Err: ${error}`;
});

// Model selection dropdown
document.addEventListener('DOMContentLoaded', function () {
    var dropdown = document.getElementById('modelMenu');

    // Model options
    var options = ['tiny', 'base', 'small', 'medium', 'large'];

    // Add options to the dropdown
    options.forEach(function (option) {
        var optionElement = document.createElement('option');
        optionElement.textContent = option;
        optionElement.value = option;
        dropdown.appendChild(optionElement);
    });
});

var dropdown = document.getElementById('modelMenu');
dropdown.addEventListener('change', function () {
    var selectedValue = this.value;
    ipcRenderer.send('dropdown-value', selectedValue);
});

// status bar update
function updateStatusBar(text) {
    const statusBar = document.getElementById('status-bar');
    statusBar.innerText = text;
}

updateStatusBar('Transcriber is ready!');

function showSettings() {
    document.getElementById('overlay').style.display = 'block';
}

function closeSettings() {
    // 假设有一个方法来关闭设置窗口
    document.getElementById('overlay').style.display = 'none';
}
