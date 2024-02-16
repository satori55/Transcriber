// renderer.js
const { ipcRenderer } = require('electron');

// Button click event
document.getElementById('transcribeButton').addEventListener('click', () => {
    ipcRenderer.send('open-file-dialog');
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
