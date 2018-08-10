// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var messages = require('./example/helloworld_pb');
var services = require('./example/helloworld_grpc_pb');
var grpc = require('grpc');
var { ipcRenderer } = require('electron');

function grpcMainTestFinished(emitter, avg) {
  console.log(avg);
  document.querySelector('.main').textContent =
    `Average roundtrip (running in main): ${Math.round(avg * 100, 2) / 100}ms`;
}

function grpcRendererTestFinished(avg) {
  document.querySelector('.renderer').textContent =
    `Average roundtrip (running in renderer): ${Math.round(avg * 100, 2) / 100}ms`;
}

function runGRPCTest(callback) {
  var client = new services.GreeterClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );
  var results = [];
  var count = 100;
  var interval = 10;
  var logged = false;
  var id = setInterval(() => {
    var request = new messages.HelloRequest();
    request.setName('a');
    var start = performance.now();
    client.sayHello(request, function(err, response) {
      var end = performance.now();
      var delta = end - start;
      //console.log('Greeting:', response.getMessage(), delta);
      if (results.length < count) {
        results.push(delta);
      } else if (!logged && results.length === count) {
        logged = true;
        clearInterval(id);
        var avg = results.reduce((accum, current) => {
          return accum + current;
        }, 0) / results.length;
        console.log(`Average roundtrip ${avg} ms`);
        callback(avg);
      }
    });
  }, interval);
}

runGRPCTest(grpcRendererTestFinished);

ipcRenderer.on('GRPC_TEST', grpcMainTestFinished);
ipcRenderer.send('GRPC_TEST');
