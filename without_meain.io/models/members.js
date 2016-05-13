var db = require('./db');
var mongoose = require('mongoose');
//var config = require('../config');
var crypto = require('crypto');


var memberSchema = mongoose.Schema({
	
	username   : String,
	password   : String, // email address
	nickname   : String,
	last_login : {type:Date, default:null},
	status     : {type:String, default:'offline'}

});



memberSchema.virtual('avatar').get(function () 
{
	var md5sum = crypto.createHash('md5').update( String(this.username).toLowerCase() ).digest('hex').toString().toLowerCase()
	return 'http://www.gravatar.com/avatar/'+md5sum+'.jpg?s=64&d=wavatar'
});

memberSchema.statics.getByUsernameAndPassword = function(username, password, fn)
{
	var md5sum = crypto.createHash('md5');
	var _u = md5sum.update(username).digest('hex').toString().toUpperCase();
	var md5sum = crypto.createHash('md5');
	var _p = md5sum.update(_u+'-'+password).digest('hex').toString().toUpperCase();
	
	Member.findOne({username:username, password:_p}).exec(fn);
}

memberSchema.statics.changeStatus = function(username, newstatus, fn)
{
	Member.update({username:username}, {'$set':{status : newstatus}}, fn)
}

memberSchema.statics.createNewMember = function(username, password, nickname, fn)
{
	var md5sum = crypto.createHash('md5');
	var _u = md5sum.update(username).digest('hex').toString().toUpperCase();
	var md5sum = crypto.createHash('md5');
	var _p = md5sum.update(_u+'-'+password).digest('hex').toString().toUpperCase();

	new Member({
		username: username,
		password: _p,
		nickname:nickname
	}).save(fn)
}

memberSchema.statics.getOnlineMembers = function(max, fn)
{
	if(max <= 0)
		max = 1;

	Member.find({status:'online'}).sort({last_login:-1}).limit(max).exec(fn)
}




var Member = db.model('member', memberSchema);
module.exports = Member;


