var Movie = require('../models/movie');
var express = require('express');
var router = express.Router();

router.route('/movies')
  .get(function(req, res) {
    Movie.find(function(err, movies) {
      if (err) {
        return res.send(err);
      }

      res.json(movies);
    });
  })
  .post(function(req, res) {
    var movie = new Movie(req.body);

    movie.save(function(err) {
      if (err) {
        return res.send(err);
      }

      var ioe = require('socket.io-emitter')({ host: 'localhost', port: 10001 });
      ioe.emit('new message', "A new movie [" + movie._id + "] is added.");
      res.send({ message: 'Movie Added', processId: process.pid });
    });
  });
  
router.route('/movies/:id').put(function(req,res){
  Movie.findOne({ _id: req.params.id }, function(err, movie) {
    if (err) {
      return res.send(err);
    }

    for (prop in req.body) {
      movie[prop] = req.body[prop];
    }

    // save the movie
    movie.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.json({ message: 'Movie updated!', processId: process.pid });
    });
  });
});

router.route('/movies/:id').get(function(req, res) {
  Movie.findOne({ _id: req.params.id}, function(err, movie) {
    if (err) {
      return res.send(err);
    }

    res.json(movie);
  });
});

router.route('/movies/:id').delete(function(req, res) {
  Movie.remove({
    _id: req.params.id
  }, function(err, movie) {
    if (err) {
      return res.send(err);
    }

    res.json({ message: 'Successfully deleted', processId: process.pid });
  });
});

module.exports = router;