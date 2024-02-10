const { PythonShell } = require('python-shell');

let options = {
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: 'src/py/'
};

PythonShell.run('he.py', options).then(messages => {
  // Use 'messages' here instead of 'results'
  console.log(messages);
}).catch(err => {
  // It's also good practice to catch any errors
  console.error('Error:', err);
});
