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

.factory("Notifications", function($firebaseArray) {
  var notifsRef = new Firebase("https://fir-project-68529.firebaseio.com/notifications");
  return $firebaseArray(notifsRef);
})



.run(function($ionicPlatform, $filter, $ionicPopup, $rootScope, $firebaseObject, $timeout) {


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    var ref = new Firebase("https://fir-project-68529.firebaseio.com/params");
    $rootScope.SelectedParams = $firebaseObject(ref);
    $rootScope.behaviourLevel = $rootScope.SelectedParams.behaviour;
    $rootScope.sms = $rootScope.SelectedParams.sms;
    $rootScope.pwd0 = $rootScope.SelectedParams.pwd0;
    $rootScope.pwd2 = $rootScope.SelectedParams.pwd2;
    $rootScope.pwd2 = $rootScope.SelectedParams.pwd2;
    $rootScope.curPwd = $rootScope.SelectedParams.curPwd;
//    alert($rootScope.SelectedParams.curPwd);



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


    cordova.plugins.notification.local.on("trigger", function(notification) {
//        updateTriggeredMeds(notification.id, notification.data, notification.text);
        var notif_ref = new Firebase("https://fir-project-68529.firebaseio.com/notifications");
        var newNotificationRef = notif_ref.push();
            newNotificationRef.set({ 'notifID': notification.id, 'medicineID': notification.data, 'medicine': notification.text,'at': $filter('date')(new Date(notification.at*1000), 'h:mm a') ,'every': angular.isUndefined(notification.every) ? '-' : notification.every, 'date': $filter('date')(new Date(), 'd MMM, y h:mm a'), 'taken':"0"});
      });


      cordova.plugins.notification.local.on("click", function (notification) {

            var notif_ref = new Firebase("https://fir-project-68529.firebaseio.com/notifications");
            notif_ref.orderByChild("notifID").equalTo(notification.id).on("child_added", function(snapshot) {
                $rootScope.choice = {"id": 1};
                var myPopup = $ionicPopup.show({
            //              template: '<ul class="list"><li class="item item-radio">Checbox 1<label class="radio"><input type="radio"></label></li><li class="item item-radio">Checkbox 2<label class="radio"><input type="radio"></label></li></ul>',
                  template: '<ion-radio ng-model="choice.id" ng-value="1"><h5>Το πήρα κανονικά</h5></ion-radio><ion-radio ng-model="choice.id" ng-value="2"><h5>Το πήρα με καθυστέρηση</h5></ion-radio><ion-radio ng-model="choice.id" ng-value="3"><h5>Δεν το πήρα/Δεν θα το πάρω</h5></ion-radio><ion-radio ng-model="choice.id" ng-value="4"><h5>Υπενθύμιση σε 30 λεπτά</h5></ion-radio>',
                  title: 'Υπενθύμιση λήψης φαρμάκου',
                  subTitle: notification.text,
                  scope: $rootScope,
                  buttons: [
                    {
                      text: 'Επιλογή',
                      type: 'button-positive',
                      onTap: function(e) {
                        var update_ref = notif_ref.child(snapshot.key());
                        update_ref.update({ taken: $rootScope.choice.id.toString()});
//                        switch ($rootScope.choice.id) {
//                            case 1:
                                cordova.plugins.notification.local.clear(notification.id, function() {
                                });
                                $rootScope.checkDropBehaviour();
//                              break;
//                      }
                      }
                    }
                  ]
                });

              });

        });


/*



          var confirmPopup = $ionicPopup.confirm({
            title: 'Ενημέρωση λήψης φαρμάκου',
            template: 'Πήρατε το φάρμακό σας όπως προβλέπεται;'
          });

          confirmPopup.then(function(res) {
            if(res) {
              var update_ref = notif_ref.child(snapshot.key());
              update_ref.update({ taken: true});
              cordova.plugins.notification.local.clear(notification.id, function() {
              });
            } else {
    //             console.log('Deletion canceled !');
            }
          });
*/


/*
cordova.plugins.notification.local.on("click", function (notification) {
    askConfirmation(notification.id, notification.data);
});
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
        controller: 'NotifListCtrl'
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

  .state('tab.options', {
    url: '/options',
    views: {
      'tab-options': {
        templateUrl: 'templates/tab-options.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('tab.takes-history', {
    url: '/options/0',
    views: {
      'tab-options': {
        templateUrl: 'templates/takes-history.html',
        controller: 'NotifListCtrl'
      }
    }
  })

  .state('tab.takes-details', {
    url: '/options/0/:notifID',
    views: {
      'tab-options': {
        templateUrl: 'templates/takes-history-details.html',
        controller: 'NotificationsCtrl'
      }
    }
  })

  .state('tab.notifications', {
    url: '/options/1',
    views: {
      'tab-options': {
        templateUrl: 'templates/tab-notifications.html',
        controller: 'MedicineCtrl'
      }
    }
  })

  .state('tab.users', {
    url: '/options/2',
    views: {
      'tab-options': {
        templateUrl: 'templates/tab-users.html',
        controller: 'UserListCtrl'
      }
    }
  })

  .state('tab.user-detail', {
    url: '/options/2/:userID',
    views: {
      'tab-options': {
        templateUrl: 'templates/user-detail.html',
        controller: 'UserCtrl'
      }
    }
  })

  .state('tab.pebble', {
    url: '/options/3',
    views: {
      'tab-options': {
        templateUrl: 'templates/tab-pebble.html',
        controller: 'MedicineCtrl'
      }
    }
  })

  .state('tab.params', {
    url: '/options/4',
    views: {
      'tab-options': {
        templateUrl: 'templates/tab-params.html',
        controller: 'ParamsCtrl'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
