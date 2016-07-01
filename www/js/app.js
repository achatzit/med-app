// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'firebase', 'starter.controllers', 'ngCordova'])


.factory("Medicines", function($firebaseArray) {
  var medicinesRef = new Firebase("https://fir-project-68529.firebaseio.com/medicines");
  return $firebaseArray(medicinesRef);
})


.factory("Users", function($firebaseArray) {
  var usersRef = new Firebase("https://fir-project-68529.firebaseio.com/users");
  return $firebaseArray(usersRef);
})



.run(function($ionicPlatform, $rootScope, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if(device.platform === "iOS") {
        window.plugin.notification.local.promptForPermission();
    }
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    Pebble.onConnect(
      function(event) {
        alert('Το ρολόι συνδέθηκε');
      },
      function(event) {
        alert('Το ρολόι αποσυνδέθηκε');
      }
    );

    Pebble.setAppUUID("3985df0d-0058-46cf-9b2e-f0c8d0bc0fab",
      function() {
      },
      function(event) { alert('failure setting UUID');
      }
    );

/*
    Pebble.launchApp(
        function() {
         },
        function(event) { alert('Αποτυχημένη σύνδεση'); }
    );


    Pebble.setAppUUID("3985df0d-0058-46cf-9b2e-f0c8d0bc0fab",
        function() {
            alert('watch connected');
        },
        function(event) {
          alert('watch disconnected');
        }
    );

    Pebble.onConnect(
      function(event) {
        alert('watch connected');
        Pebble.onAppMessageReceived(function(message){
            console.log(message);
            alert(message);
        });
        Pebble.sendAppMessage({0: "hello"},
          function() { alert('message sent'); },
          function(event) { alert('message failure'+event.data); });
      },
      function(event) {
        alert('watch disconnected');
      }
    );
*/
    cordova.plugins.notification.local.on("schedule", function(notification) {
      alert("Η υπενθύμιση για λήψη ("+notification.text+") ενεργοποιήθηκε!");
    });

/*
    cordova.plugins.notification.local.on("trigger", function(notification) {
        alert("triggered: " + notification.id+notification.text+(new Date(notification.firstAt)));
        cordova.plugins.notification.local.isTriggered(notification.id, function (present) {
            alert(present ? "present" : "not found");
        });
    });

    cordova.plugins.notification.local.on("cancel", function(notification) {
      alert("Ακύρωση υπενθύμισης φαρμάκου "+notification.id+" !");
    });
*/
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('tab.meds', {
    url: '/meds',
    views: {
      'tab-meds': {
        templateUrl: 'templates/tab-meds.html',
        controller: 'MedListCtrl'
      }
    }
  })
  .state('tab.med-detail', {
    url: '/meds/:medID',
    views: {
      'tab-meds': {
        templateUrl: 'templates/med-detail.html',
        controller: 'MedicineCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('tab.users', {
    url: '/settings/0',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-users.html',
        controller: 'UserListCtrl'
      }
    }
  })
  .state('tab.user-detail', {
    url: '/settings/0/:userID',
    views: {
      'tab-settings': {
        templateUrl: 'templates/user-detail.html',
        controller: 'UserCtrl'
      }
    }
  })

  .state('tab.notifications', {
    url: '/settings/1',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-notifications.html',
        controller: 'MedicineCtrl'
      }
    }
  })

  .state('tab.pebble', {
    url: '/settings/2',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-pebble.html',
        controller: 'MedicineCtrl'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
