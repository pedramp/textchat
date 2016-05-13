var db = require('./db');
var mongoose = require('mongoose');
//var config = require('../config');
var crypto = require('crypto');


var memberSchema = mongoose.Schema({
	
	username   : { type: String, index: { unique: true } }, 
	email      : String,
	password   : String, 
	nickname   : String,
	last_login : {type:Date, default:null},
	status     : {type:String, default:'offline'}

});



memberSchema.virtual('avatar').get(function () 
{
	var md5sum = crypto.createHash('md5').update( String(this.email).toLowerCase() ).digest('hex').toString().toLowerCase()
	return 'http://www.gravatar.com/avatar/'+md5sum+'.jpg?s=64&d=wavatar'
});


memberSchema.statics.getByUsernameAndPassword = function(username, password, fn)
{
	var md5sum = crypto.createHash('md5');
	var _u = md5sum.update( String(username) ).digest('hex').toString().toLowerCase();
	var md5sumx = crypto.createHash('md5');
	var _p = md5sumx.update(_u+'-'+String(password)).digest('hex').toString().toLowerCase();
	
	Member.findOne({username:username, password:_p}).exec(fn);
}

memberSchema.statics.changeStatus = function(username, newstatus, fn)
{
	if(fn == null)
		fn = function(){};

	Member.update({username:username}, {'$set':{status : newstatus}}, fn);
}

memberSchema.statics.updateLoginDate = function(username)
{
	Member.update({username:username}, {'$set':{last_login : new Date()}}, function(err, data)
	{
		// done.
	})
}



memberSchema.statics.createNewMember = function(username, password, nickname, email, fn)
{
	var md5sum = crypto.createHash('md5');
	var _u = md5sum.update(String(username)).digest('hex').toString().toLowerCase();
	var md5sum = crypto.createHash('md5');
	var _p = md5sum.update(_u+'-'+String(password)).digest('hex').toString().toLowerCase();

	new Member({
		email: email,
		username: username,
		password: _p,
		nickname: nickname
	}).save(fn)
}

memberSchema.statics.getMembersByStatus = function(status,max, fn)
{
	if(max <= 0)
		max = 1;
	if(status == null)
		status = 'online';

	Member.find({status:status}, {username:1, nickname:1, status:1}).sort({last_login:-1}).limit(max).exec(fn)
}




var Member = db.model('member', memberSchema);
module.exports = Member;


