var memberModel = require('../models/members');
var messagesModel = require('../models/messages');

module.exports = {

	newMessage : function(req, res)
	{
		/**
	     * @route:/api/v1/rest/message/new
	     * @method:put
	     * @restricted:true
	     */
	    
	    res.json({test:'ok'})
	},



	getMessageHistory : function(req, res)
	{
		/**
	     * @route:/api/v1/rest/message/history/from/%from/to/%to
	     * @method:get
	     * @restricted:true
	     */
	    messagesModel.getHistory(req.params.from, req.params.to, 200, function(err, data)
	    {
	    	var result = [];
	    	if(err == null && data != null)
	    	{
	    		result = data;
	    	}

	    	// mock
	    	while(result.length < parseInt(Math.random() * 20)+1)
	    		result.push( {from : req.params.from, to : req.params.to, date : new Date(), msg : req.params.to + ' - ' +  String(Math.random())}  )

	    	res.json(result)
	    })
	},



	onlineMembers : function(req, res)
	{
		/**
	     * @route:/api/v1/rest/members/status/%status
	     * @method:get
	     * @restricted:true
	     */
	    
	    memberModel.getMembersByStatus('online', 100, function(err, data)
	    {
	    	var result = [];
	    	if(err == null && data != null)
	    	{
	    		result = data;
	    	}

	    	// mock object 
	    	result = [{
	    		username   : 'username',
				nickname   : 'nickname',
				status     : 'online'
	    	},
	    	{
	    		username   : 'username2',
				nickname   : 'nickname2',
				status     : 'online'
	    	}]

	    	res.json(result);
	    })
	    
	}


}