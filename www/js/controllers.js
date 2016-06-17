

angular.module('starter.controllers', ['ionic', 'firebase'])

.factory('Medicine', function ($firebaseArray, $firebaseObject) {
  var ref = new Firebase("https://fir-project-68529.firebaseio.com");
  var meds = $firebaseArray(ref.child("medicines"));
  console.log(meds);
  var Medicine = {
    all: meds,
    getName: function (medID) {
      return $firebaseObject(ref.child("medicines/"+medID+"/name"));
    },
    getDosage: function (medID) {
      return $firebaseObject(ref.child("medicines/"+medID+"/dosage"));
    },
    getType: function (medID) {
      return $firebaseObject(ref.child("medicines/"+medID+"/type"));
    },
    gettime: function (medID) {
      return $firebaseObject(ref.child("medicines/"+medID+"/retTime"));
    },
    getAll: function (medID) {
      return $firebaseArray(ref.child("medicines").child(medID));
      //  return $firebaseArray(ref.child(medID));
    }
  };

  return Medicine;
})

.controller("MedicineCtrl", function($scope,$rootScope, $filter, $stateParams, $firebaseObject, $firebaseArray, $cordovaLocalNotification, $cordovaDatePicker) {
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
        $scope.selectNotifications();
      });
    }
//})

//.controller("ReminderController", function($scope, $filter, $stateParams, $cordovaLocalNotification, $firebaseObject) {




    $scope.$on("$cordovaLocalNotification:schedule", function(id, state, json) {
      alert("Η υπενθύμιση ενεργοποιήθηκε!");
    });

    $scope.$on("$cordovaLocalNotification:cancel", function(id, state, json) {
      alert("Ακύρωση υπενθύμισης!");
    });

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

    $scope.scheduleSingleNotification = function () {
      $cordovaLocalNotification.schedule({
        id: 1,
        title: 'Title here',
        text: 'Text here',
        autoCancel: false,
        data: {
          customProperty: 'custom value'
        }
      }).then(function (result) {
        // ...
      });
    };

    $scope.scheduleEveryWeekNotification = function (repeat, message) {
      if ($scope.SelectedMed.remSwitch) {
        var alarmTime = new Date($scope.SelectedMed.remTime);
        var tmStamp = new Date().getTime();
        var medicine = $scope.SelectedMed.name;
        $cordovaLocalNotification.schedule({
          id: tmStamp,
          title: message + ' υπενθύμιση',
          text: medicine,
          autoCancel: false,
          at: alarmTime,
          every: repeat
        }).then(function (result) {
          // ...
        });
        $scope.SelectedMed.remID = tmStamp;
        $scope.SelectedMed.$save();
      } else {

      $scope.cancelSingleNotification();

      }
    };

    $scope.scheduleDelayedNotification = function () {
      if ($scope.SelectedMed.remSwitch) {
          var alarmTime = new Date($scope.SelectedMed.remTime);
          var medicine = $scope.SelectedMed.name;
//          var _10SecondsFromNow = new Date(now + 60 * 1000);
          alarmTime.setMinutes(alarmTime.getMinutes());
          $rootScope.counter++;
          var tmStamp = new Date().getTime();
//          var tmStamp2 = tmStamp.toString();
          $cordovaLocalNotification.schedule({
            id: tmStamp,
            title: "Υπενθύμιση Φαρμάκου",
            text: medicine,
            autoCancel: false,
            at: alarmTime
          }).then(function (result) {
            //
          });
          $scope.SelectedMed.remID = tmStamp;
          $scope.SelectedMed.$save();
      } else {

        $scope.cancelSingleNotification();

      }
    };

    $scope.cancelSingleNotification = function () {
      var cancelRem = $scope.SelectedMed.remID;
      $cordovaLocalNotification.cancel(cancelRem).then(function (result) {
        $scope.SelectedMed.remID = 0;
        $scope.SelectedMed.$save();
        // ...
      });
    };

    $scope.add = function() {
      var alarmTime = new Date();
//        var alarmTime = $filter('date')($scope.SelectedMed.remTime, 'hh:mm');
      if ($scope.SelectedMed.remSwitch) {
        alarmTime = $filter('date')($scope.SelectedMed.remTime, 'yyyy-MM-dd HH:mm:ss');
        var medicine = $scope.SelectedMed.name;
//        var now = new Date($scope.SelectedMed.remTime,'yyyy-MM-dd HH:mm:ss');
//        alarmTime.setMinutes(alarmTime.getMinutes()+1);
        $cordovaLocalNotification.add({
            id: medicine+alarmTime.toString(),
            date: alarmTime,
            message: alarmTime + ' '+ medicine,
            title: "Υπενθύμιση Φαρμάκου",
            autoCancel: true,
            sound: null
        }).then(function () {
            console.log("The notification has been set");
        });

      }
    };

    $scope.isScheduled = function() {
        $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
            alert("Notification 1234 Scheduled: " + isScheduled);
        });
    }

})



.controller("ListCtrl", function($scope, $filter, $ionicListDelegate,Medicines) {
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

.controller('MedDetailCtrl', function($scope, $stateParams, Medicine) {

  $scope.medName = Medicine.getName($stateParams.medID);
  $scope.medDosage = Medicine.getDosage($stateParams.medID);
  $scope.medType = Medicine.getType($stateParams.medID);
  $scope.medTime = Medicine.gettime($stateParams.medID);
  $scope.medData = Medicine.getAll($stateParams.medID);

  console.log($scope.chat);

})

.controller('medTimeController', ['$scope', function($scope) {
  $scope.medTime = {
    value: new Date(2016, 1, 1, 08, 00, 0)
  };
}])


.controller('SettingsCtrl', function($scope) {
  $scope.Setts = ["Χρήστες"];

});
