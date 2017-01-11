var http = require('http');
var cluster = require('cluster'); // Only required if you want the worker id
var sticky = require('sticky-session');
var app = require('../app'); //Require our app

var server = http.createServer(app);
var clientId = 0;

var port = 8000;

if (!sticky.listen(server, port, {
    workers: 3
})) {
    // Master code    
    server.once('listening', function() {
        console.log('server started on port %d', port);
    });
    
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    });
} else {
    // Worker code
    var io = require("socket.io").listen(server);
    var redis = require('socket.io-redis');
    io.adapter(redis({ host: 'localhost', port: 10001 }));
    
    io.on('connection', function (socket) {
        console.log("WS connection is accepted by worker #" + process.pid);
        socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            /*socket.broadcast.emit('new message', {
                username: socket.username,
                message: data
            });*/
            console.log("Receive message: " + data);
            //var ioe = require('socket.io-emitter')({ host: 'localhost', port: 10001 });
            //ioe.emit('new message', "Server -- " + data);
        });
        
        socket.on('disconnect', function () {
            console.log("==a user disconnected==");
            var ioe = require('socket.io-emitter')({ host: 'localhost', port: 10001 });
            ioe.emit('user disconnect');
        });
    });
}