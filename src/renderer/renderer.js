// renderer.js
const { ipcRenderer } = require('electron');

document.getElementById('transcribeButton').addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('transcription-result', (event, data) => {
    // show transcription result
    document.getElementById('transcriptionResult').textContent = data;
  });
  
  ipcRenderer.on('transcription-error', (event, error) => {
    // error
    document.getElementById('transcriptionResult').textContent = `错误: ${error}`;
  });