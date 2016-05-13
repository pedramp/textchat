var memberModel = require('../models/members');

module.exports = {

	index : function(req, res)
	{
		/**
	     * @route:/
	     * @method:all
	     * @restricted:false
	     */
	    memberModel.findOne({}, function(err, data)
	    {
	    	console.log(err, data);
	    })
	    res.render('index', {name:'sample'})
	}


}