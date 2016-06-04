/**
* TextChat Project
*/
/*!*/

var program = require('commander');


program
  .version('0.0.1')
  .option('-e, --evn <e>', 'environment mode')
  .option('-p, --port <p>', 'webserver port')
  .parse(process.argv);


if(process.env.NODE_ENV !== null)
  program.evn = String(process.env.NODE_ENV); // environment variable has more priority for me!

global.config = require('./configs/' + ( (program.evn !== null)  ? program.evn : 'development' )  );

// application post, default is 6363 
if(program.port !== null)
	config.port = parseInt(program.port);

 
var express = require('express');
var app = express();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var engines = require("hogan-express");
var route = require('./libs/route');
var socket = require('./libs/socket');
var server = require('http').Server(app);
var io = require('socket.io')(server);

// setup default layout.html file
app.set('view options', {layout: 'layout'});

// To avoid conflicts with Angular's template engine, I just replace {{}} signs in mustach template engine with [[]] characters
app.locals.delimiters = '[[ ]]';

// mt default template engine is hogan
app.engine('html', engines);
app.set('view engine', 'html');
app.set('views', config.path.views+'/');
app.use(express.static(config.path.static));
app.use(express.static(config.path.static_bower));
app.disable('x-powered-by');
app.use(bodyParser.urlencoded( config.body_parser ));


// setup coockie to store some authorization things
var cookieParser = require('cookie-parser')();
var session = require('cookie-session')({
  cookie: { maxAge: config.session.cookieAge },
  resave: false,
  saveUninitialized: config.session.saveUninitialized, 
  store: new RedisStore(config.redis_client),
  secret: config.session.secret
});

app.use(cookieParser);
app.use(session);

// share Cookie with SocketIO package
io.use(function(socket, next) {
    var req = socket.handshake;
    var res = {};
    cookieParser(req, res, function(err) {
        if (err) return next(err);
        session(req, res, next);
    });
});

// setup my handmade router, this function just initiate before openning ports.
route(app, config);

// setup socketIO with my express instance 
socket(app, io, config);

//app.listen(config.port); // without socketio
server.listen(config.port); // socketio
console.log('init port ' + config.port);

