/**
* Basic Configuration
*/

var path = require('path');
module.exports = {

	port : 6363,
	db : {
		path : 'mongodb://localhost/text-chat', // mongodb databse 
		opts : { 
			db: { native_parser: true },
			server: { auto_reconnect: false }
		}
	},
	
	redis_client : {
		host : '127.0.0.1',
		port : 6379,
		ttl : 3600 // one hour
	},
	session: {
		saveUninitialized : true,
		secret : 'text-chat-6363',
		cookieAge: 60000
	},
	body_parser: { limit:'250mb', extended: false, parameterLimit: 10000 },

	// expres settings
	path : {
		controller : path.resolve('.') + '/controllers',
		views : path.resolve('.') + '/views',
		static : path.resolve('.') + '/public',
		static_bower : path.resolve('.') + '/bower_components',
	}
}