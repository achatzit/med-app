
angular.module('starter.controllers',['ionic', 'firebase'])


.controller("NotificationsCtrl", function($scope,$rootScope,$ionicPopup, $stateParams, $firebaseObject, $firebaseArray ) {
  var ref = new Firebase("https://fir-project-68529.firebaseio.com/notifications/" + $stateParams.notifID);

    $scope.SelectedNotif = $firebaseObject(ref);
    $scope.DateRem = Date(ref.child("date"));

    $scope.takesHistorySave = function() {
      if ($rootScope.SelectedParams.curPwd > 0) {
        $scope.SelectedNotif.$save();
        $rootScope.checkDropBehaviour();
      } else {
        alert("Δεν έχετε δικαιώματα αλλαγών!")
        window.location.reload();
      }
    };

/*    var iconSelect;
        $rootScope.iconSelect = new IconSelect("my-icon-select",
            {'selectedIconWidth':48,
            'selectedIconHeight':48,
            'selectedBoxPadding':1,
            'iconsWidth':23,
            'iconsHeight':23,
            'boxIconSpace':1,
            'vectoralIconNumber':4,
            'horizontalIconNumber':4});
        var icons = [];
        icons.push({'iconFilePath':'img/caps1.png', 'iconValue':'1'});
        icons.push({'iconFilePath':'img/caps2.png', 'iconValue':'2'});
        icons.push({'iconFilePath':'img/caps3.png', 'iconValue':'3'});
        icons.push({'iconFilePath':'img/caps4.png', 'iconValue':'4'});

        $rootScope.iconSelect.refresh(icons);
*/

})

.controller("NotifListCtrl", function($scope, $rootScope, $cordovaEmailComposer, $cordovaSms, $filter, $ionicListDelegate,Notifications) {
  $scope.notifs = Notifications;

  $scope.deleteNotif = function(notif) {
    var notifRef = new Firebase("https://fir-project-68529.firebaseio.com/notifications/" + notif.$id);
    notifRef.remove(onComplete);
  };


  $rootScope.medBehaviour = function() {
    var notifRef = new Firebase("https://fir-project-68529.firebaseio.com/notifications");
    notifRef.once("value", function(snapshot) {
      $scope.sum1 = snapshot.numChildren();
      $scope.intakes1 = 0;$scope.intakes2 = 0;$scope.intakes3 = 0;$scope.intakes4 = 0;$scope.intakes0 = 0;
      $scope.score = $scope.intakes1*2+$scope.intakes2-$scope.intakes3*2;
      snapshot.forEach(function(childSnapshot) {
        var taken = childSnapshot.child("taken").val();
        if (taken == "1") $scope.intakes1++;
        if (taken == "2") $scope.intakes2++;
        if (taken == "3") $scope.intakes3++;
        if (taken == "4") $scope.intakes4++;
        if (taken == "0") $scope.intakes0++;
      });
    });
    $scope.behaviour1 = $scope.intakes1*100/$scope.sum1;
    $scope.behaviour2 = $scope.intakes2*100/$scope.sum1;
    $scope.behaviour3 = $scope.intakes3*100/$scope.sum1;
    $scope.behaviour4 = $scope.intakes4*100/$scope.sum1;
    $scope.behaviour0 = $scope.intakes0*100/$scope.sum1;
    $scope.score = ($scope.intakes1*2+$scope.intakes2-$scope.intakes3*2)/$scope.sum1;
    $rootScope.score2 = ($scope.score +2) * 100 / 4;
//    if ($scope.score2 > 60) {
//      alert($scope.score2);
//      $scope.sendEmail('std076089@ac.eap.gr');
//    }
  };

  var onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
    }
  };


  $rootScope.checkDropBehaviour = function() {
      var oldScore = $rootScope.score2;
      $rootScope.medBehaviour();
      if (oldScore >= $rootScope.SelectedParams.behaviour && $rootScope.score2 < $rootScope.SelectedParams.behaviour) {
        if ($rootScope.SelectedParams.sms) {
          $rootScope.sendSMS();
        }
      }
  };


  $rootScope.sendSMS = function() {

    $cordovaSms
      .send($rootScope.SelectedParams.smsNo, 'ΜΗΝΥΜΑ ΑΠΟ ΕΦΑΡΜΟΓΗ MEDAPP\nΤο ποσοστό συμπεριφοράς του ασθενούς έπεσε κάτω από '+$rootScope.SelectedParams.behaviour.toString(), {
        replaceLineBreaks: true, // true to replace \n by a new line, false by default
        android: {
          intent: '' // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
            //intent: 'INTENT' // send SMS inside a default SMS app
        }
      })
      .then(function() {
//        alert('Success');
        // Success! SMS was sent
      }, function(error) {
//        alert('Error');
        // An error occurred
      });
  };

  $rootScope.sendEmail= function() {
    alert($rootScope.score2);
      if(window.plugins && window.plugins.emailComposer) {
          window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
              alert("Response -> " + result);
          },
          "Μήνυμα από εφαρμογή medApp", // Subject
          "Το ποσοστό συμπεριφοράς του ασθενούς έπεσε κάτω από "+$rootScope.behaviourLevel.toString(),                      // Body
          ["aha@cityofxanthi.gr"],    // To
          null,                    // CC
          null,                    // BCC
          false,                   // isHTML
          null,                    // Attachments
          null);                   // Attachment Data
      } else {
        alert("no plugin found");
      }
  };

})

.controller("ParamsCtrl", function($scope,$rootScope,$ionicPopup, $stateParams, $firebaseObject, $firebaseArray ) {

      $scope.chkAccessPwd = function(pwd) {
      if (pwd == $rootScope.SelectedParams.pwd0 ||pwd == $rootScope.SelectedParams.pwd1 || pwd == $rootScope.SelectedParams.pwd2) {
        if (pwd == $rootScope.SelectedParams.pwd1) $rootScope.SelectedParams.curPwd = 1;
        if (pwd == $rootScope.SelectedParams.pwd2) $rootScope.SelectedParams.curPwd = 2;
        if (pwd == $rootScope.SelectedParams.pwd0) $rootScope.SelectedParams.curPwd = 0;
        $rootScope.SelectedParams.$save();
        alert("Το επίπεδο πρόσβασής σας άλλαξε σε επίπεδο " + $rootScope.SelectedParams.curPwd);
//          $scope.refreshItems();
//        window.location.reload();
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

  $scope.deleteUser = function(pw) {
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
    $scope.medTypes = ['Χάπι','Κάψουλα','Σιρόπι','Σταγόνες','Ένεση'];
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
      if ($rootScope.SelectedParams.curPwd > 0) {
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
      } else {
        alert("Δεν έχετε δικαίωμα διαγραφής υπενθυμίσεων");
      }
    };

    $scope.testPebble = function() {
      Pebble.launchApp(
        function() {
            setTimeout(function() {
              $scope.$apply(function() {
              Pebble.sendAppMessage({124: "Επιβεβαίωση σύνδεσης με το κινητό!"},
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



.controller("MedListCtrl", function($scope, $ionicPopup, $filter, $ionicListDelegate,Medicines) {
  $scope.medicines = Medicines;
  $scope.addMed = function() {
  $scope.data = {};
  $ionicPopup.prompt({
      title: 'Καταχώρηση φαρμάκου',
      template: '<label class="item item-input"><span class="input-label">Όνομα: </span><input type="text" ng-model="data.name"></label><label class="item item-input item-select">Είδος: <select ng-model="data.type"><option selected="true"><img src="img/caps1.jpg"/>Χάπι</option><option>Κάψουλα</option><option>Σιρόπι</option><option>Σταγόνες</option><option>Ένεση</option></select></label><label class="item item-input"><span class="input-label">Δοσολογία: </span><input type="number" step=0.5  ng-model="data.dosage"></label>',
      defaultText: '',// String (default: ''). The initial value placed into the input.
      maxLength: 15, // Integer (default: null). Specify a maxlength attribute for the input.
      cancelText: 'Άκυρο',// String (default: 'Cancel'. The text of the Cancel button.
      okText: 'Καταχώρηση', // String (default: 'OK'). The text of the OK button.
      scope: $scope
    }).then(function(res) {
/*
    $ionicPopup.prompt({
        title: 'Καταχώρηση φαρμάκου',
        subTitle : 'Τύπος φαρμάκου',
        template: '<label class="item item-input"><span class="input-label">Δοσολογία</span><input type="number" step=0.5></label>',
        okText: 'Καταχώρηση' // String (default: 'OK'). The text of the OK button.
      }).then(function(dosage) {
      $ionicPopup.prompt({
          title: 'Καταχώρηση φαρμάκου',
          template: '<ion-radio ng-value="Χάπι"><h5>Χάπι</h5></ion-radio><ion-radio ng-value="Κάψουλα"><h5>Κάψουλα</h5></ion-radio><ion-radio ng-value="Σιρόπι"><h5>Σιρόπι</h5></ion-radio>',
          cancelText: 'Άκυρο',// String (default: 'Cancel'. The text of the Cancel button.
          okText: 'Καταχώρηση' // String (default: 'OK'). The text of the OK button.
        }).then(function(type) {
          alert("type"+type);
//          if (name && type && dosage) {
            $scope.medicines.$add({
              "name": name,
              "type": type,
              "dosage": dosage,
              "remTime": Firebase.ServerValue.TIMESTAMP,
              "remID": new Date().getTime(),
              "remSwitch": false,
              "repeats": "",
            });
//          }
        });
        alert("dosage"+dosage);
      });
*/
          if ($scope.data.name && $scope.data.type && $scope.data.dosage) {
            $scope.medicines.$add({
              "name": $scope.data.name,
              "type": $scope.data.type,
              "dosage": $scope.data.dosage,
              "remTime": Firebase.ServerValue.TIMESTAMP,
              "remID": new Date().getTime(),
              "remSwitch": false,
              "repeats": "(χωρίς)",
            });
          }
      });
//    var name = prompt("Καταχωρήστε ένα νέο φάρμακο: ");
//    var type = prompt("Είδος: ");
//    var dosage = parseFloat(prompt("Δοσολογία: "));
//    var remTime = $filter('date')(Date.now(), 'HH:mm');
//setTimeout(function() {
//  }, 10000);

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


.controller('HomeCtrl', function($scope, $rootScope) {})

.controller('SettingsCtrl', function($scope, $rootScope) {
  $scope.Setts = ['Λήψεις','Υπενθυμίσεις','Χρήστες','Pebble','Παράμετροι'];
});
