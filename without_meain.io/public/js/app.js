(function() {
  'use strict';

  angular.module('app', ['textChat.index']);
  angular.module('app').controller('PrivateWindow', PrivateWindow);
  angular.module('app').controller('OnlineMembers', OnlineMembers);
  angular.module('textChat.index', []);

  var _whoami = 'username_me';

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
    for(var i=0; i<activePrivateChatWindows.length; i++)
    {
      if(activePrivateChatWindows[i].to == username)
        activePrivateChatWindows[i].active = 'active';
      else 
        activePrivateChatWindows[i].active = '';
    }

      $('.pw-window').css('display', 'none')
      $('#pw-'+username).css('display', 'block');


      if(firstTimeOpenNewWindow.indexOf(username) == -1)
      { 
        $http({
          method: 'GET',
          url: '/api/v1/rest/message/history/from/'+_whoami+'/to/'+username
        }).then(function successCallback(response) 
        {
          if(response != null && response.data != null)
            messageArchive[username] = response.data;

        }.bind(this), function errorCallback(response) {
            messageArchive[username] = [];
        });
      }
      firstTimeOpenNewWindow.push(username)

  }


  function PrivateWindow( $scope, $http) {

    var pw = this;

    pw.windows = activePrivateChatWindows

    $scope.activeWindow = function(username)
    {
      activatePrivatechatWindow(username, $http)
    }

    pw.messages = messageArchive;

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
    
    $scope.newchat = function(member)
    {
      var b = true;
      for(var i=0; i<activePrivateChatWindows.length; i++)
      {
        if(activePrivateChatWindows[i].to == member.username)
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

    mm.members = [
        // {username:'username 1', nickname: 'nickname 1'},
        // {username:'username 2', nickname: 'nickname 2'}
      ];
      $http({
        method: 'GET',
        url: '/api/v1/rest/members/status/online'
      }).then(function successCallback(response) 
      {
        if(response != null && response.data != null)
          mm.members = response.data;
      }.bind(this), function errorCallback(response) {
          // error
      });
  };


})();
