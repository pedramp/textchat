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
app.use(session({
  cookie: { maxAge: config.session.cookieAge },
  resave: false,
  saveUninitialized: config.session.saveUninitialized, 
  store: new RedisStore(config.redis_client),
  secret: config.session.secret
}));

route(app, config);
app.listen(config.port);
console.log('init port ' + config.port);

