var program = require('commander');


program
  .version('0.0.1')
  .option('-e, --evn <e>', 'environment mode')
  .option('-p, --port <p>', 'webserver port')
  .parse(process.argv);

config = require('./configs/' + ( (program.evn != null)  ? program.evn : 'development' )  );

if(program.port != null)
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


app.set('view options', {layout: 'layout'});
//app.locals.delimiters = '<% %>';
app.locals.delimiters = '[[ ]]';
app.engine('html', engines);
app.set('view engine', 'html');
app.set('views', config.path.views+'/');
app.use(express.static(config.path.static));
app.use(express.static(config.path.static_bower));
app.disable('x-powered-by');
app.use(bodyParser.urlencoded( config.body_parser ));
//


var cookieParser = require('cookie-parser')();
var session = require('cookie-session')({
  cookie: { maxAge: config.session.cookieAge },
  resave: false,
  saveUninitialized: config.session.saveUninitialized, 
  store: new RedisStore(config.redis_client),
  secret: config.session.secret
});

/*app.use(session({
  cookie: { maxAge: config.session.cookieAge },
  resave: false,
  saveUninitialized: config.session.saveUninitialized, 
  store: new RedisStore(config.redis_client),
  secret: config.session.secret
}));*/

app.use(cookieParser);
app.use(session);
io.use(function(socket, next) {
    var req = socket.handshake;
    var res = {};
    cookieParser(req, res, function(err) {
        if (err) return next(err);
        session(req, res, next);
    });
});

route(app, config);
socket(app, io, config);

//app.listen(config.port); // without socketio
server.listen(config.port); // socketio
console.log('init port ' + config.port);

