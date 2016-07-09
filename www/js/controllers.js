
angular.module('starter.controllers',['ionic', 'firebase'])



.controller("NotificationsCtrl", function($scope,$rootScope,$ionicPopup, $stateParams, $firebaseObject, $firebaseArray ) {
  var ref = new Firebase("https://fir-project-68529.firebaseio.com/notifications/" + $stateParams.notifID);

    $scope.SelectedNotif = $firebaseObject(ref);
    $scope.DateRem = Date(ref.child("date"));
})

.controller("NotifListCtrl", function($scope, $filter, $ionicListDelegate,Notifications) {
  $scope.notifs = Notifications;

  $scope.deleteNotif = function(notif) {
    var notifRef = new Firebase("https://fir-project-68529.firebaseio.com/notifications/" + notif.$id);
    notifRef.remove(onComplete);
  };


  $scope.medBehaviour = function() {
    var notifRef = new Firebase("https://fir-project-68529.firebaseio.com/notifications");
    notifRef.once("value", function(snapshot) {
      $scope.sum1 = snapshot.numChildren();
      $scope.intakes = 0;
      snapshot.forEach(function(childSnapshot) {
        var taken = childSnapshot.child("taken").val();

//        var taken = key.child("taken");
//        $scope.intakes++;
        if (taken) $scope.intakes++;
      });
    });
  };

  var onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
    }
  };
})

.controller("UserCtrl", function($scope,$rootScope,$ionicPopup, $stateParams, $firebaseObject, $firebaseArray ) {
    var ref = new Firebase("https://fir-project-68529.firebaseio.com/users/" + $stateParams.userID);
    // download user's profile data into a local object
    // all server changes are applied in realtime

    $scope.SelectedUser = $firebaseObject(ref);
    $scope.userTypes = ['Ασθενής','Ιατρός','Συγγενής'];

})

.controller("UserListCtrl", function($scope, $filter, $ionicListDelegate,Users) {
  $scope.users = Users;
  $scope.addUser = function() {
    var name = prompt("Καταχωρήστε το όνομα του χρήστη: ");
    var type = prompt("Ιδιότητα: ");
    var email = prompt("E-mail: ");
    var mobile = prompt("Κινητό τηλ.: ");
    if (name) {
      $scope.users.$add({
        "name": name,
        "type": type,
        "email": email,
        "mobile": mobile,
        "notifications":{},
      });
    }
  };

  $scope.deleteUser = function(user) {
    var userRef = new Firebase("https://fir-project-68529.firebaseio.com/users/" + user.$id);
    userRef.remove(onComplete);

  };

  var onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
    }
  };
})


.controller("MedicineCtrl", function($scope,$rootScope,$ionicPopup, $filter, $stateParams, $firebaseObject, $firebaseArray, $cordovaDatePicker) {
    var ref = new Firebase("https://fir-project-68529.firebaseio.com/medicines/" + $stateParams.medID);
    // download medicine's profile data into a local object
    // all server changes are applied in realtime


    $scope.SelectedMed = $firebaseObject(ref);
    // Το παρακάτω ίσως δεν χρειάζεται
    $scope.SelectedMed.remTime = ref.child("remTime");
    $scope.medTypes = ['Χάπι','Κάψουλα','Σιρόπι'];
    $scope.repeats = ['(χωρίς)','ημέρα','εβδομάδα','μήνα'];

    $scope.showTimePicker = function() {
//    var options = {date: $filter('date')($scope.SelectedMed.remTime, 'HH:mm'), mode: 'time'};
    var options = {date: new Date(), mode: 'time'};
    $cordovaDatePicker.show(options).then(function(date){
//        $scope.SelectedMed.remTime = $filter('date')(date, 'HH:mm');
        $scope.SelectedMed.remTime = date.getTime();
        $scope.SelectedMed.$save();
        if($scope.SelectedMed.remSwitch) {
          $scope.selectNotifications();
        }
      });
    };

    $scope.selectNotifications = function () {
        switch ($scope.SelectedMed.repeats) {
            case '(χωρίς)':
                $scope.scheduleDelayedNotification();
                break;
            case 'ημέρα':
                $scope.scheduleEveryWeekNotification("day", 'Ημερήσια');
                break;
            case 'εβδομάδα':
                $scope.scheduleEveryWeekNotification("week", 'Εβδομαδιαία');
                break;
            case 'μήνα':
                $scope.scheduleEveryWeekNotification("month", 'Μηνιαία');
                break;
            default:

        }
    };

    $scope.scheduleEveryWeekNotification = function (repeat, message) {
      if ($scope.SelectedMed.remSwitch) {
        var alarmTime = new Date($scope.SelectedMed.remTime);
        var tmStamp = new Date().getTime();
        var medicineId = $scope.SelectedMed.$id;
        var medicine = $scope.SelectedMed.name + ' ' + $scope.SelectedMed.dosage + ' ' + $scope.SelectedMed.type ;
        $scope.cancelSingleNotification();
        $scope.SelectedMed.remID = tmStamp;
        $scope.SelectedMed.$save();
        cordova.plugins.notification.local.schedule({
          id: tmStamp,
          title: message + ' υπενθύμιση',
          text: medicine,
          autoCancel:false,
          ongoing: true,
          firstAt: alarmTime,
          at: alarmTime,
          every: repeat,
          data: medicineId
        });
      } else {
          $scope.cancelSingleNotification();
          alert("Ακύρωση υπενθύμισης φαρμάκου "+$scope.SelectedMed.name+" !");
      }
    };

    $scope.scheduleDelayedNotification = function () {
      if ($scope.SelectedMed.remSwitch) {
          var alarmTime = new Date($scope.SelectedMed.remTime);
          var medicine = $scope.SelectedMed.name + ' ' + $scope.SelectedMed.dosage + ' ' + $scope.SelectedMed.type ;
          var medicineId = $scope.SelectedMed.$id;
//          var _10SecondsFromNow = new Date(now + 60 * 1000);
//          alarmTime.setMinutes(alarmTime.getMinutes());
          var tmStamp = new Date().getTime();
          $scope.cancelSingleNotification();
          $scope.SelectedMed.remID = tmStamp;
          $scope.SelectedMed.$save();
          cordova.plugins.notification.local.schedule({
            id: tmStamp,
            title: "Υπενθύμιση Φαρμάκου",
            text: medicine,
            autoCancel:false,
            ongoing: true,
            firstAt: alarmTime,
            at: alarmTime,
            data: medicineId
          });
      } else {
          $scope.cancelSingleNotification();
          alert("Ακύρωση υπενθύμισης φαρμάκου "+$scope.SelectedMed.name+" !");
      }
    };


    $scope.cancelSingleNotification = function () {
      var cancelRem = $scope.SelectedMed.remID;
      cordova.plugins.notification.local.cancel(cancelRem);
      $scope.SelectedMed.remID = 0;
      $scope.SelectedMed.$save();
    };




    $scope.getAllNotIDs = function() {
          cordova.plugins.notification.local.getAll(function (notifs) {
            $scope.notifs = notifs;
          });
    };

    $scope.getAllNotIDs();

    $scope.getScheduledIDs = function() {
//      setTimeout(function() {
//        $scope.$apply(function() {
          cordova.plugins.notification.local.getScheduled(function (notifs) {
            $scope.Snotifs = notifs;
          });
//        });
//      }, 2000);
    };

    $scope.getScheduledIDs();

    $scope.getTriggeredIDs = function() {
//      setTimeout(function() {
//        $scope.$apply(function() {
          cordova.plugins.notification.local.getTriggered(function (notifs) {
            $scope.Tnotifs = notifs;
          });
//        });
//      }, 2000);
    };

    $scope.getTriggeredIDs();

    $scope.clearAllIDs = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Εκκαθάριση υπενθυμίσεων',
        template: 'Θέλετε να εκκαθαρίσετε τις ήδη ενεργοποιημένες υπενθυμίσεις;'
      });

      confirmPopup.then(function(res) {
        if(res) {
              cordova.plugins.notification.local.clearAll(function () {
                alert("Έγινε εκκαθάριση των ήδη ενεργοποιημένων υπενθυμίσεων");
                window.location.reload();
              });
        } else {
//             console.log('Deletion canceled !');
        }
      });

    };


    $scope.cancelAllIDs = function() {
         var confirmPopup = $ionicPopup.confirm({
           title: 'Διαγραφή μελλοντικών υπενθυμίσεων',
           template: 'Θέλετε να διαγράψετε όλες τις μελλοντικές υπενθυμίσεις;'
         });

         confirmPopup.then(function(res) {
           if(res) {
                 cordova.plugins.notification.local.cancelAll(function () {
                   alert("Έγινε διαγραφή όλων των μελλοντικών υπενθυμίσεων");
                   window.location.reload();
                 });
           } else {
//             console.log('Deletion canceled !');
           }
         });
    };

    $scope.testPebble = function() {
      Pebble.launchApp(
        function() {
            setTimeout(function() {
              $scope.$apply(function() {
              Pebble.sendAppMessage({124: "Hello!"},
                  function() { },
                  function(event) { alert('failure sending message'); });
            });
          }, 3000);
        },
        function(event) { alert('failure launching app'); });
    };



/*
    $scope.testPebble = function() {
      Pebble.setAppUUID("3985df0d-0058-46cf-9b2e-f0c8d0bc0fab",
          function() {
            Pebble.launchApp(
                function() {
                    Pebble.sendAppMessage({0: "hello"},
                        function() { alert('Επιτυχής σύνδεση'); },
                        function(event) { alert('failure sending message'); });
                     },
                function(event) { alert('failure launching app'); });
            },
          function(event) { alert('failure setting UUID');
          });
    };
*/

})



.controller("MedListCtrl", function($scope, $filter, $ionicListDelegate,Medicines) {
  $scope.medicines = Medicines;
  $scope.addMed = function() {
    var name = prompt("Καταχωρήστε ένα νέο φάρμακο: ");
    var type = prompt("Είδος: ");
    var dosage = parseFloat(prompt("Δοσολογία: "));
//    var remTime = $filter('date')(Date.now(), 'HH:mm');
    if (name && type && dosage) {
      $scope.medicines.$add({
        "name": name,
        "type": type,
        "dosage": dosage,
        "remTime": Firebase.ServerValue.TIMESTAMP,
        "remID": new Date().getTime(),
        "remSwitch": false,
        "repeats": "",
      });
    }
  };

  $scope.getMedicine = function(medicine) {
    var medicineRef = new Firebase("https://fir-project-68529.firebaseio.com/medicines/" + medicine.$id);
      var nameRef = medicineRef.child('name')
    return nameRef;
  };

  $scope.deleteMedicine = function(medicine) {
    var medicineRef = new Firebase("https://fir-project-68529.firebaseio.com/medicines/" + medicine.$id);
    medicineRef.remove(onComplete);

  };

  var onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
    }
  };
})


.controller('HomeCtrl', function($scope) {})

.controller('SettingsCtrl', function($scope) {
  $scope.Setts = ['Υπενθυμίσεις','Χρήστες','Pebble'];

});
