/**
* API class.
*/
/*!*/


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

	/**
	 * just to change user's `status` in databse.
	 * @param  {Object}   req
	 * @param  {Object}   res
	 * @param  {Function} next
	 * @return {Object}  an object like this: {error:false}. this result is static and it's not depends on user's status or other parameters
	 */
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
	

	/**
	 * to authenticate user with its username and password
	 * @param  {Object}   req
	 * @param  {Object}   res
	 * @param  {Function} next
	 * @return {Object}  JSON result contains `error` parameter that is true or false. 
	 */
	authenticate : function(req, res)
	{
		/**
	     * @route:/api/v1/rest/member/authenticate
	     * @method:post
	     * @restricted:true
	     */
	    
	    memberModel.getByUsernameAndPassword(req.body.username, req.body.password, function(err, data)
	    {
	    	if(err === null && data !== null && data.username === req.body.username)
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


	/**
	 * get history of messages between two users
	 * @param  {Object}   req
	 * @param  {Object}   res
	 * @param  {Function} next
	 * @return {Array}  array of messages 
	 */
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
	    	if(err === null && data !== null)
	    	{
	    		result = data;
	    	}

	    	// // mock
	    	// while(result.length < parseInt(Math.random() * 20)+1)
	    	// 	result.push( {from : req.params.from, to : req.params.to, date : new Date(), msg : req.params.to + ' - ' +  String(Math.random())}  )

	    	res.json(result)
	    })
	},


	/**
	 *  get list of online users,  100 limitation in result
	 * @param  {Object}   req
	 * @param  {Object}   res
	 * @param  {Function} next
	 * @return {Array} Array of online users.
	 */
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
	    	if(err === null && data !== null)
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