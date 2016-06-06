
//angular.module('starter.services', ['ionic', 'firebase', 'starter.controllers', 'starter.services'])


//angular.module('starter.services', [])
/*

.factory('Medicine', function ($firebaseArray, $firebaseObject) {
  var ref = new Firebase("https://fir-project-68529.firebaseio.com");
  var meds = $firebaseArray(ref.child("medicines"));
console.log(meds)//var ref = new Firebase("https:ref.child(
var Medicine = {
all: meds,
get: function (medID) {
  return $firebaseObject(meds.child(medID));
}
};

return Medicine;
});
*/
/*

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };


});
*/
