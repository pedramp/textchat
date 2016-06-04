/**
* Members module.
*/
/*!*/

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



/**
 * apply avatar image in results by `gravatar` service
 */
memberSchema.virtual('avatar').get(function () 
{
	var md5sum = crypto.createHash('md5').update( String(this.email).toLowerCase() ).digest('hex').toString().toLowerCase()
	return 'http://www.gravatar.com/avatar/'+md5sum+'.jpg?s=64&d=wavatar'
});


/**
 * get user by its username and password
 * @param  {String}   username username
 * @param  {String}   password plain password
 * @param  {Function} fn       callback function
 * @return {Object}            member isntance
 */
memberSchema.statics.getByUsernameAndPassword = function(username, password, fn)
{
	var md5sum = crypto.createHash('md5');
	var _u = md5sum.update( String(username) ).digest('hex').toString().toLowerCase();
	var md5sumx = crypto.createHash('md5');
	var _p = md5sumx.update(_u+'-'+String(password)).digest('hex').toString().toLowerCase();
	
	Member.findOne({username:username, password:_p}).exec(fn);
}

/**
 * change status in databse
 * @param  {String}   username  username
 * @param  {String}   newstatus new status, example: online,offline,busy, etc..
 * @param  {Function} fn        callback function, it's optional
 * @return {Object}             N/A
 */
memberSchema.statics.changeStatus = function(username, newstatus, fn)
{
	if(fn === null)
		fn = function(){};

	Member.update({username:username}, {'$set':{status : newstatus}}, fn);
}


/**
 * just update last login date for an user
 * @param  {String} username username
 * @return {Object}          N/A
 */
memberSchema.statics.updateLoginDate = function(username)
{
	Member.update({username:username}, {'$set':{last_login : new Date()}}, function(err, data)
	{
		// done.
	})
}


/**
 * cretae new user 
 * @param  {String}   username username of user
 * @param  {String}   password plain password
 * @param  {String}   nickname nickname to show in chat history
 * @param  {String}   email    email address to login and notify user
 * @param  {Function} fn       callback function
 * @return {Object}            member's information
 */
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


/**
 * get members by latest status in database
 * @param  {String}   status status to query
 * @param  {Number}   max    limit in result
 * @param  {Function} fn     callback function
 * @return {Array}          Array of members
 */
memberSchema.statics.getMembersByStatus = function(status,max, fn)
{
	if(max <= 0)
		max = 1;
	if(status === null)
		status = 'online';

	Member.find({status:status}, {username:1, nickname:1, status:1}).sort({last_login:-1}).limit(max).exec(fn)
}



// init members instance and share it by `exports` to other modules.
var Member = db.model('member', memberSchema);
module.exports = Member;


