var db = require('./db');
var mongoose = require('mongoose');

// mongoddb is not good idea to store huge textChat history. 
var messagesSchema = mongoose.Schema({
	
	from : String, // username
	to : String, // username    {type:[String], default:[]} // array of receivers
	date : Date, // date time
	msg : String,  // message content

	// is_read: {type:Boolean, default:false}, 
	// session_id: String // each conversation/chat window has unique ID
});


messagesSchema.statics.getHistory = function(from, to, max, fn)
{
	Message.find({from:from, to:to}).sort({date:-1}).limit(max).exec(fn);
}

messagesSchema.statics.addNewMessage = function(from, to, msg, fn)
{
	if(fn == null)
		fn = function(){};

	var md5sum = crypto.createHash('md5');
	var _u = md5sum.update(username).digest('hex').toString().toUpperCase();
	var md5sum = crypto.createHash('md5');
	var _p = md5sum.update(_u+'-'+password).digest('hex').toString().toUpperCase();

	new Message({
		from: from,
		to: to,
		msg: String(msg).replace(/\$/g, '\$'),
		date : new Date()
	}).save(fn)
}


var Message = db.model('message', messagesSchema);
module.exports = Message;


