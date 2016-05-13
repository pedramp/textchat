var memberModel = require('../models/members');

module.exports = function(req, res, next)
{
	if(req.session != null && req.session.member != null && req.session.member.username != null)
	{
		next();
	}else
	{
		res.redirect('/');
	}
}