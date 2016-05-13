
module.exports = {

	index : function(req, res)
	{
		/**
	     * @route:/
	     * @method:all
	     * @restricted:false
	     */
	    
	    res.render('index', {name:'sample'})
	}


}