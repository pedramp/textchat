var fs = require('fs');
var memberModel = require('../models/members');
var messageModel = require('../models/messages');
var clients = {};

function getByUsername(username)
{
	for(var i in clients)
	{
		if(clients[i] != null && clients[i].handshake != null && clients[i].handshake.session != null &&
		 clients[i].handshake.session.member != null && clients[i].handshake.session.member.username == username)
			return clients[i]
	}
	return null
}

function notifyOnlineMembers()
{
	memberModel.getMembersByStatus('online', 200, function(err, dt)
	{
		for(var i in clients)
		{
			if(clients[i] != null && clients[i].handshake != null && clients[i].handshake.session != null && clients[i].handshake.session.member != null)
				clients[i].emit('members', dt);
		}
	})
}


module.exports = function(app, io, config)
{

	io.on('connection', function (socket) 
	{

		clients[socket.id] = socket; // cache item
		notifyOnlineMembers();
		
		if(socket.handshake != null && socket.handshake.session != null && socket.handshake.session.member != null && 
	  			socket.handshake.session.member.username != null)
  		{
        	memberModel.changeStatus(socket.handshake.session.member.username, 'online', notifyOnlineMembers);
        }


	    socket.on('disconnect', function() {
	        
	        clients[socket.id] = null; // clear cache

	        if(socket.handshake != null && socket.handshake.session != null && socket.handshake.session.member != null && 
	  			socket.handshake.session.member.username != null)
	  		{
	        	memberModel.changeStatus(socket.handshake.session.member.username, 'offline', notifyOnlineMembers)
	        }
	    });

		
	  
	  socket.on('private', function (data) 
	  {
	  	if(socket.handshake != null && socket.handshake.session != null && socket.handshake.session.member != null && 
	  		socket.handshake.session.member.username != null && socket.handshake.session.member.username == data.from)
	  	{
	  		var s = getByUsername(data.to);
	  		if(s != null)
	  			s.emit('private_', data);

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