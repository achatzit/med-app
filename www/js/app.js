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


    cordova.plugins.notification.local.on("schedule", function(notification) {
      alert("Η υπενθύμιση για το φάρμακο "+notification.text+" ενεργοποιήθηκε!");
    });

/*
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
          controller: 'ListCtrl'
        }
      }
    })
    .state('tab.med-detail', {
      url: '/meds/:medID',
      views: {
        'tab-meds': {
          templateUrl: 'templates/med-detail.html',
          controller: 'MedicineCtrl'
//          controller: 'ListCtrl'
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
          controller: 'SettingsCtrl'
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
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
