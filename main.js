// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
      // sandbox: true,
      // nodeIntegration: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var messages = require('./example/helloworld_pb');
var services = require('./example/helloworld_grpc_pb');
var grpc = require('grpc');
const { performance } = require('perf_hooks');

function runGRPCTest() {
  var client = new services.GreeterClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );
  var results = [];
  var count = 100;
  var interval = 10;
  var id = setInterval(() => {
    var request = new messages.HelloRequest();
    request.setName('');
    var start = performance.now();
    client.sayHello(request, function(err, response) {
      var end = performance.now();
      var delta = end - start;
      //console.log('Greeting:', response.getMessage(), delta);
      if (results.length < count) {
        results.push(delta);
      } else if (results.length === count) {
        clearInterval(id);
        var avg = results.reduce((accum, current) => {
          return accum + current;
        }, 0) / results.length;
        console.log(`Average roundtrip ${avg} ms`);
      }
    });
  }, interval);
}

runGRPCTest();