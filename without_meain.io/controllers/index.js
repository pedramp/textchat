var memberModel = require('../models/members');

module.exports = {


	chat : function(req, res)
	{
		/**
	     * @route:/chat
	     * @method:all
	     * @restricted:true
	     */
	    
	    // memberModel.findOne({}, function(err, data)
	    // {
	    // 	console.log(err, data);
	    // })
	 	
	    res.render('index', {layout:'layout', pageTitle:'Index', port:config.port, whoami:req.session.member.username})
	}


}