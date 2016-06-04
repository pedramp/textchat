(function() {
  'use strict';

  angular.module('app', ['textChat.index']);
  angular.module('app').controller('PrivateWindow', PrivateWindow);
  angular.module('app').controller('OnlineMembers', OnlineMembers);
  angular.module('textChat.index', []);


  var onlineUsers = [];
  var staticScopeMessages;
  var staticHTTP;
  var messageArchive = {
    //'username' : [{date: new Date(), msg:'hi'}, {date: new Date(), msg:'by'}],
    //'username2' : [{date: new Date(), msg:'hi 222'}, {date: new Date(), msg:'by 222'},{date: new Date(), msg:'by 222'}]

  };

  var firstTimeOpenNewWindow = [];
  var activePrivateChatWindows = [
      // {from:'ff', to:'tt', nickname:'nick1'},
      ]

  function activatePrivatechatWindow(username, $http)
  {
    if($http == null) // null OR undefined
      $http = staticHTTP;

    for(var i=0; i<activePrivateChatWindows.length; i++)
    {
      if(activePrivateChatWindows[i].to === username)
        activePrivateChatWindows[i].active = 'active';
      else 
        activePrivateChatWindows[i].active = '';
    }

      $('.pw-window').css('display', 'none')
      $('#pw-'+username).css('display', 'block');


      if(firstTimeOpenNewWindow.indexOf(username) === -1)
      { 
        $http({
          method: 'GET',
          url: '/api/v1/rest/message/history/from/me/to/'+username
        }).then(function successCallback(response) 
        {
          if(response !== null && response.data !== null)
            messageArchive[username] = response.data;
          gotoBottom();

        }, function errorCallback(response) {
            messageArchive[username] = [];
        });
      }
      firstTimeOpenNewWindow.push(username)

  }


  function PrivateWindow( $scope, $http) {

    var pw = this;
    staticHTTP = $http;
    pw.windows = activePrivateChatWindows

    $scope.activeWindow = function(username)
    {
      activatePrivatechatWindow(username, $http)
    }

    pw.messages = messageArchive;





    $scope.pushNewMessage = function(username)
    {
        if(this.inputText === '')
          return

        if(messageArchive[ username ] === null)
          messageArchive[ username ] = [];

        var d = { date: new Date(), msg:this.inputText, from:_whoami, to:username};
        messageArchive[ username ].push(d)
        this.inputText = '';
        socket.emit('private', d);
        gotoBottom();
    }

    pw.sendMessage = function(message, username) {
      if(message && message !== '' && username) {
        pw.messages.push({
          'username': username,
          'content': message
        });
      }
    };

  };







function OnlineMembers($http, $scope) {
    var mm = this;
    onlineUsers = mm;
    $scope.newchat = function(member)
    {
      if(member.username === _whoami)
        return;

      var b = true;
      for(var i=0; i<activePrivateChatWindows.length; i++)
      {
        if(activePrivateChatWindows[i].to === member.username)
          b = false;
      }
      if(b)
      {
        activePrivateChatWindows.push({
          from:'',
          to:member.username,
          nickname:member.nickname,
        })
      }
      //
      activatePrivatechatWindow(member.username, $http)
    };
    staticScopeMessages = $scope;
    mm.members = [];
      $http({
        method: 'GET',
        url: '/api/v1/rest/members/status/online'
      }).then(function successCallback(response) 
      {
        if(response !== null && response.data !== null)
        {
          mm.members = response.data;
          for(var i=0; i<mm.members.length; i++)
          {
            if(mm.members[i].username === _whoami)
              mm.members[i].disabled = 'disabled'
            else
              mm.members[i].disabled = ''
          }
        }
          

          

      }, function errorCallback(response) {
          // error
      });
  };




  socket.on('private_', function(data) {

      if( messageArchive[ data.from ] == null ) // null or undefined
        messageArchive[ data.from ] = [];
      messageArchive[ data.from ].push(data);

      // refresh scope
      if(staticScopeMessages !== null)
        staticScopeMessages.$apply();

      gotoBottom();
    });

    socket.on('members', function(data) {
      onlineUsers.members = data;
      //onlineUsers.$apply();
      for(var i=0; i<onlineUsers.members.length; i++)
      {
        if(onlineUsers.members[i].username === _whoami)
          onlineUsers.members[i].disabled = 'disabled'
        else
          onlineUsers.members[i].disabled = ''
      }
    });

})();




function gotoBottom()
{
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
}