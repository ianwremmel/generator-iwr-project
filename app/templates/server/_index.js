'use strict';

// TODO add a development-mode https instance)

var http = require('http');
var path = require('path');

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');

var app = express();

// Configure Logging
// --------------

if (app.get('env') !== 'production') {
  app.use(morgan('dev', {
    immediate: true
  }));
}
else {
  app.use(morgan('tiny'));
}

// Configure Browserify
// --------------------

if (app.get('env') === 'development') {
  var browserify = require('browserify-middleware');

  <% if (usePolymer) { %>
  app.use('/elements', browserify('src/app/elements/', {
    noParse: ['jquery'],
    transform: [
      'envify',
      // TODO configure uglifyify to only remove sections; don't minify or
      // obfuscate
      'uglifyify'
    ],
    debug: true
  }));
  <% } %>
  app.use('/scripts', browserify('src/app/scripts/', {
    noParse: ['jquery'],
    transform: [
      'envify',
      // TODO configure uglifyify to only remove sections; don't minify or
      // obfuscate
      'uglifyify'
    ],
    debug: true
  }));
}

// Configure LESS
// --------------
if (app.get('env') === 'development') {
  var less = require('less-middleware');
  app.use(less(path.join(__dirname, '../app/styles'), {
    dest: path.join(__dirname, '../../.tmp/static')
  }));
}

// TODO prevent directory browsing

// Enable gzip/deflate
// -------------------
app.use(compression());

// TODO configure static routes

// Configure development server to support pushState routes.
// --------------------------------------------------------
// (production server should do this in nginx)

if (app.get('env') !== 'production') {
  app.get('/*', function(req, res) {
    res.sendfile('index.html', {
      root: path.join(__dirname, '../app')
    });
  });
}

// Start the server
// ----------------

var port = app.get('port') || process.env.PORT || 3000;
http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});
