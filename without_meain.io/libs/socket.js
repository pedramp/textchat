/**
* SocketIO Class.
*/


var fs = require('fs');
var memberModel = require('../models/members');
var messageModel = require('../models/messages');

//  store online socket clients
var clients = {};

/**
 * get online user by its username
 * @param  {String} username username
 * @return {Object}          socketIO client
 */
function getByUsername(username)
{
	for(var i in clients)
	{
		if(clients[i] !== null && clients[i].handshake !== null && clients[i].handshake.session !== null &&
		 clients[i].handshake.session.member !== null && clients[i].handshake.session.member.username === username)
			return clients[i]
	}
	return null
}


/**
 * notify updated clients to all online users	
 */
function notifyOnlineMembers()
{
	memberModel.getMembersByStatus('online', 200, function(err, dt)
	{
		for(var i in clients)
		{
			if(clients[i] !== null && clients[i].handshake !== null && clients[i].handshake.session !== null && clients[i].handshake.session.member !== null)
				clients[i].emit('members', dt);
		}
	})
}


/**
 * init socketIO instance based on express application
 * @param  {Object} app    express instance
 * @param  {Object} io     SocketIO instance
 * @param  {Object} config configuration
 */
module.exports = function(app, io, config)
{


	io.on('connection', function (socket) 
	{

		clients[socket.id] = socket; // cache item
		notifyOnlineMembers();
		
		if(socket.handshake !== null && socket.handshake.session !== null && socket.handshake.session.member != null && 
	  			socket.handshake.session.member.username !== null)
  		{
  			// update status of user in database
        	memberModel.changeStatus(socket.handshake.session.member.username, 'online', notifyOnlineMembers);
        }


	    socket.on('disconnect', function() {
	        
	        clients[socket.id] = null; // clear cache

	        if(socket.handshake !== null && socket.handshake.session !== null && socket.handshake.session.member != null && 
	  			socket.handshake.session.member.username !== null)
	  		{
	  			// update status of user in database
	        	memberModel.changeStatus(socket.handshake.session.member.username, 'offline', notifyOnlineMembers)
	        }
	    });

		
	  
	  socket.on('private', function (data) 
	  {
	  	if(socket.handshake !== null && socket.handshake.session !== null && socket.handshake.session.member !== null && 
	  		socket.handshake.session.member.username !== null && socket.handshake.session.member.username === data.from)
	  	{
	  		var s = getByUsername(data.to);
	  		if(s !== null)
	  			s.emit('private_', data); // notify to other user


	  		// update databse
	  		messageModel.addNewMessage(data.from, data.to, data.msg, function(err, dt)
	  		{
	  			// stored! 
	  		})
	  	}else
	  	{
	  		// something is wrong!
	  	}
	  });

	});

}