/**
* Members module.
*/


var memberModel = require('../models/members');

module.exports = {

	

	/**
	 * to logout memmber and clea session, this URL redirect user to main page with `/` URL.
	 * @param  {Object}   req
	 * @param  {Object}   res
	 * @param  {Function} next
	 * @return
	 */
	logout : function(req, res)
	{
		/**
	     * @route:/logout
	     * @method:all
	     * @restricted:false
	     */
	    
	    
	    req.session.member = null;
	    res.redirect('/');
	    
	},
	

	/**
	 * Login page to authenticate user with its username/password. this page works witg POST and GET methods.
	 * @param  {Object}   req
	 * @param  {Object}   res
	 * @param  {Function} next
	 * @return {String} render login page
	 */
	login : function(req, res)
	{
		/**
	     * @route:/
	     * @method:all
	     * @restricted:false
	     */
	    

	   	// check http method to check posted username/password or only render pure page in GET mode.
	    if(req.method === 'POST')
	    {
	    	// nickname is not empty then user submitted signup form.
	    	if(req.body.nickname !== null) // signup
	    	{
	    		
	    		memberModel.createNewMember(req.body.username, req.body.password, req.body.nickname, req.body.email, function(err, data)
	    		{
	    			if(err == null && data !== null)
	    				res.render('login', {layout:'layout', whoami:null, error:false, newuser:true})
	    			else
	    				res.render('login', {layout:'layout', whoami:null, error:true})
	    		})

	    	}else // signin
	    	{
	    		// user submitted signin form. 
	    		memberModel.getByUsernameAndPassword(req.body.username, req.body.password, function(err, data)
			    {
			    	if(err == null && data !== null && data.username === req.body.username)
			    	{
			    		// fill session witg username.
			    		req.session.member = {username : req.body.username }
			    		
			    		// update last login date
			    		memberModel.updateLoginDate(req.body.username);

			    		// redirect user to `/chat` page to start workin with application
			    		res.redirect('/chat');
			    	}else 
			    	{
			    		// oops! username/password is not valid. 
			    		
			    		// clear session and render login page again.
			    		req.session.member = null;
			    		res.render('login', {layout:'layout', whoami:null, error:true})
			    	}
			    })
	    	}
	    }else
	    {
	    	// render pure login page in GET http mode.
	    	res.render('login', {layout:'layout', whoami:null})
	    }
	}


}