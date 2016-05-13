var path = require('path');
module.exports = {

	port : 6363,
	db : {
		path : 'mongodb://localhost/text-chat' 
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

	path : {
		controller : path.resolve('.') + '/controllers',
		views : path.resolve('.') + '/views',
		static : path.resolve('.') + '/public',
	}
}