/**
* Route Module.
*/


var fs = require('fs');
var auth = require('./auth');

/**
 * main route method, this method can handle all routes
 * @param  {Object} app    express instance
 * @param  {Object} config config instance
 */
module.exports = function(app, config)
{
	// generate route
	fs.readdirSync(config.path.controller).forEach(function(name){
	  if(name.indexOf('.js') > 0)
	  {
	    var obj = require(config.path.controller+'/'+name);
	    for(var key in obj)
	    {
	      //  parse /** **/ patterms to find custom parameters inside of controllers
	      var pattern = /\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*/igm;
	      var methodContent = obj[key].toString().replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
	      var results = methodContent.match(pattern);
	      var options = {};

	      if(results)
	      {
	          for(var i= 0;i<results.length;i++)
	          {
	              result = results[i];
	              if(result.indexOf("*") !== -1)
	              {
	                  splited = result.split("*");
	                  for(var j=0; j<splited.length; j++)
	                  {
	                      var optionItem = String(splited[j]).replace(/\ /g, '');
	                      if(optionItem.indexOf("@") !== 0)
	                        continue;

	                      optionItem = optionItem.substr(1,optionItem.length).split(":");
	                      if(optionItem[0] === "params" || optionItem[0] === "route")
	                        optionItem[1] = optionItem[1].split("#").join(":");
	                      
	                      options[optionItem[0]] = optionItem[1];
	                  }
	              }
	          }
	      }

	      if(options.route !== null)
	      {
	        options.method = String(options.method).split(',');
	        for(var j=0; j<options.method.length; j++)
	        {
	          options.route = String(options.route).replace(/%/ig, ':');
	          var middlewares = [];

	          // adding authentication method only for `restriced` mehtod 
	          if(String(options.restricted) === 'true')
	            middlewares.push(auth);
	            


	          // calling methods in controllers
	          app[options.method[j]](options.route, middlewares, obj[key]);
	        }
	        
	      }

	    }
	  }
	});
	
	
	/**
	 * 500 AND 404 pages, these methods written after all routes 
	 */
	app.use(function(err, req, res, next)
	{
	  res.status(500).end('500');
	});

	app.use(function(req, res, next)
	{
	  res.status(404).end('404 ['+ req.originalUrl +']');
	});
	
}