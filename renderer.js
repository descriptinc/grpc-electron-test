// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const grpcTest = require('./grpcTest');
var { ipcRenderer } = require('electron');

function grpcMainTestFinished(emitter, avg) {
  document.querySelector('.main').textContent =
    `Average gRPC roundtrip (running in main): ${Math.round(avg * 100, 2) / 100}ms`;
}

function grpcRendererTestFinished(avg) {
  document.querySelector('.renderer').textContent =
    `Average gRPC roundtrip (running in renderer): ${Math.round(avg * 100, 2) / 100}ms`;
}

grpcTest(grpcRendererTestFinished);

ipcRenderer.on('GRPC_TEST', grpcMainTestFinished);
ipcRenderer.send('GRPC_TEST');
