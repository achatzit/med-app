

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
    getAll: function (medID) {
      return $firebaseArray(ref.child("medicines").child(medID));
      //  return $firebaseArray(ref.child(medID));
    }
  };

  return Medicine;
})

.controller("MedicineCtrl", function($scope, $stateParams, $firebaseObject) {
    var ref = new Firebase("https://fir-project-68529.firebaseio.com/medicines/" + $stateParams.medID);
    // download medicine's profile data into a local object
    // all server changes are applied in realtime
    $scope.SelectedMed = $firebaseObject(ref);
    $scope.medTypes = ['Χάπι','Κάψουλα','Σιρόπι'];
  })

.controller("ListCtrl", function($scope, $ionicListDelegate,Medicines) {
  $scope.medicines = Medicines;
  $scope.addMed = function() {
    var name = prompt("Καταχωρήστε ένα νέο φάρμακο: ");
    var type = prompt("Είδος: ");
    var dosage = parseInt(prompt("Δοσολογία: "));
    if (name && type && dosage) {
      $scope.medicines.$add({
        "name": name,
        "type": type,
        "dosage": dosage,
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
  $scope.medData = Medicine.getAll($stateParams.medID);

  console.log($scope.chat);

})

.controller('medTimeController', ['$scope', function($scope) {
  $scope.medTime = {
    value: new Date(2016, 1, 1, 08, 00, 0)
  };
}])

.controller('medAmountController', ['$scope', function($scope) {


  $scope.medAmount = {
    value: 1
  };

}])

.controller('SettingsCtrl', function($scope) {
  $scope.Setts = ["Χρήστες"];

});
