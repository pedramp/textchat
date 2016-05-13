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

	iamOnlineNow : function(req, res)
	{
		/**
	     * @route:/api/v1/rest/member/iamonline
	     * @method:get
	     * @restricted:true
	     */
	    
	     memberModel.changeStatus(req.session.member.username, 'online');
	     res.json({error:false});
	},
	
	authenticate : function(req, res)
	{
		/**
	     * @route:/api/v1/rest/member/authenticate
	     * @method:post
	     * @restricted:true
	     */
	    
	    memberModel.getByUsernameAndPassword(req.body.username, req.body.password, function(err, data)
	    {
	    	if(err == null && data != null && data.username == req.body.username)
	    	{
	    		req.session.member = {username : req.body.username }
	    		res.json({error:false, username: req.body.username});
	    	}else 
	    	{
	    		// oops!
	    		req.session.member = null;
	    		res.json({error:true, username: ''});
	    	}
	    })
	    
	},


	getMessageHistory : function(req, res)
	{
		/**
	     * @route:/api/v1/rest/message/history/from/me/to/%to
	     * @method:get
	     * @restricted:true
	     */
	    messagesModel.getHistory(req.session.member.username, req.params.to, 200, function(err, data)
	    {
	    	var result = [];
	    	if(err == null && data != null)
	    	{
	    		result = data;
	    	}

	    	// // mock
	    	// while(result.length < parseInt(Math.random() * 20)+1)
	    	// 	result.push( {from : req.params.from, to : req.params.to, date : new Date(), msg : req.params.to + ' - ' +  String(Math.random())}  )

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
	   //  	result = [{
	   //  		username   : 'username',
				// nickname   : 'nickname',
				// status     : 'online'
	   //  	},
	   //  	{
	   //  		username   : 'username2',
				// nickname   : 'nickname2',
				// status     : 'online'
	   //  	}]

	    	res.json(result);
	    })
	    
	}


}