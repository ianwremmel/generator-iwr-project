'use strict';
<% if (useNewrelic) { %>
var newrelic = require('newrelic');
<% } %>
// TODO add https

var http = require('http');
var path = require('path');

var express = require('express');
// Engines
var cons = require('consolidate');

// Middleware
var compression = require('compression');
var morgan = require('morgan');

var app = express();

// Configure Templating <% if (useNewrelic) { %>
app.locals.newrelic = newrelic;<% } %>
app.engine('html', cons.lodash);

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../app'));

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

// TODO if env === 'test', add uglifyify
if (app.get('env') === 'development') {
  var browserify = require('browserify-middleware');

  // TODO add uglifyify for env===test <% if (usePolymer) { %>
  app.use('/elements', browserify('src/app/elements/', {
    noParse: ['jquery'],
    transform: [
      'envify',
    ],
    debug: true
  }));
  <% } %>
  app.use('/scripts', browserify('src/app/scripts/', {
    noParse: ['jquery'],
    transform: [
      'envify'
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

<% if (useBower) { %>
// Enable static routes
// --------------------
app.use('/bower_components', express.static('bower_components'));<% } %>

// Configure development server to support pushState routes.
// --------------------------------------------------------
// (production server should do this in nginx)

if (app.get('env') !== 'production') {
  // TODO make sure this route 404s if there is a file extension.
  app.get(/\/.*/, function(req, res) {
    res.render('index.html', {
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
