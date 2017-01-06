var http = require('http');
var cluster = require('cluster'); // Only required if you want the worker id
var sticky = require('sticky-session');
var WebSocketServer = require('ws').Server;
var app = require('../app'); //Require our app

var server = http.createServer(app);
var clientId = 0;

if (!sticky.listen(server, 8000, {
    workers: 3
})) {
    // Master code
    server.once('listening', function() {
        console.log('server started on port ' + 8000);
    });
    
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
    });
} else {
    // Worker code
    var wss = new WebSocketServer({server: server});
    wss.on('connection', function (ws) {
        var thisId = ++clientId;
        console.log('Client #%d connected, worker: #%d', thisId, cluster.worker.id);
        
        ws.on('message', function (data, flags) {
            console.log("Worker: #%d, Receive a message: %s, flags: %s", cluster.worker.id, data, JSON.stringify(flags));
            ws.send(data);
        });
        
        ws.on('close', function () {
            console.log('Client #%d disconnected, worker: #%d', thisId, cluster.worker.id);
        });
        
        ws.on('error', function (e) {
            console.log('Client #%d error: %s, worker: #%d', thisId, e.message, cluster.worker.id);
        });
    });
}