/**
* Authentication module.
*/


var memberModel = require('../models/members');

/**
 * only check username in session.
 * @param  {Object}   req  
 * @param  {Object}   res  
 * @param  {Function} next 
 */
module.exports = function(req, res, next)
{
	// is session empty or not! 
	if(req.session !== null && req.session.member !== null && req.session.member.username !== null)
	{
		// everything is ok 
		next();
	}else
	{
		// something goes wrong, user cannot continue and redirect to main page
		res.redirect('/');
	}
}