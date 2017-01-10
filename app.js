var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var movies = require('./routes/movies'); //routes are defined here
var app = express(); //Create the Express app

var promise = require("bluebird");

//connect to our database
//Ideally you will obtain DB details from a config file
var dbName = 'movieDB';
var connectionString = 'mongodb://localhost:27018/' + dbName;

mongoose.Promise = promise;
mongoose.connect(connectionString);

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api', movies); //This is our route middleware
app.use('/libs', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));



module.exports = app;