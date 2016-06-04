/**
* Index module.
*/
/*!*/

var memberModel = require('../models/members');

module.exports = {

	/**
	 * to render `/chat/` page
	 * @param  {Object}   req
	 * @param  {Object}   res
	 * @param  {Function} next
	 * @return {String} rendered html of page.
	 */
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