var messages = require('./example/helloworld_pb');
var services = require('./example/helloworld_grpc_pb');
var grpc = require('@grpc/grpc-js');
const { performance } = require('perf_hooks');

function grpcTest(callback) {
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
    request.setName('');
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

module.exports = grpcTest;
