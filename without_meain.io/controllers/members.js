var memberModel = require('../models/members');

module.exports = {

	
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
	

	login : function(req, res)
	{
		/**
	     * @route:/
	     * @method:all
	     * @restricted:false
	     */
	    

	    
	    
	    if(req.method == 'POST')
	    {
	    	if(req.body.nickname != null) // signup
	    	{
	    		
	    		memberModel.createNewMember(req.body.username, req.body.password, req.body.nickname, req.body.email, function(err, data)
	    		{
	    			if(err == null && data != null)
	    				res.render('login', {layout:'layout', whoami:null, error:false, newuser:true})
	    			else
	    				res.render('login', {layout:'layout', whoami:null, error:true})
	    		})

	    	}else // signin
	    	{
	    		memberModel.getByUsernameAndPassword(req.body.username, req.body.password, function(err, data)
			    {
			    	if(err == null && data != null && data.username == req.body.username)
			    	{
			    		req.session.member = {username : req.body.username }
			    		// update last login date
			    		memberModel.updateLoginDate(req.body.username);

			    		res.redirect('/chat');
			    	}else 
			    	{
			    		// oops!
			    		req.session.member = null;
			    		res.render('login', {layout:'layout', whoami:null, error:true})
			    	}
			    })
	    	}
	    }else
	    {
	    	res.render('login', {layout:'layout', whoami:null})
	    }
	}


}