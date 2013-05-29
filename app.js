
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , connect = require('connect')
  , path = require('path')
  , imageEventStream = require('./imageEventStream');

var app = express(),
  corsSupport = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.header('Access-Control-Max-Age', '1728000');

    next();
  };

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(connect.bodyParser());
app.use(express.methodOverride());
app.use(corsSupport);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/', routes.indexPOST);
app.get('/', routes.indexGET);
app.options("/", function(req, res){
  res.send();
});

app.get('/eventSource', function eventSourceHandler(request, response) {

  response.writeHead(200, {
    "Content-Type":"text/event-stream",
    "Cache-Control":"no-cache",
    "Connection":"keep-alive"
  });

  function newImageNotifier() {
    response.write('event: image_changed\n\n');
    response.write('data: ' + "there is a new image" + '\n\n');
  }

  imageEventStream.on("new_image", newImageNotifier);

  request.on('close', function () {
    // Unsubscribe
    imageEventStream.removeListener("new_image", newImageNotifier);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
