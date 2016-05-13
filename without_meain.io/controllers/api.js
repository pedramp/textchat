var memberModel = require('../models/members');
var messagesModel = require('../models/messages');

module.exports = {

	newMessage : function(req, res)
	{
		/**
	     * @route:/api/v1/rest/message/new
	     * @method:get
	     * @restricted:true
	     */
	    
	    res.json({test:'ok'})
	}
	
}