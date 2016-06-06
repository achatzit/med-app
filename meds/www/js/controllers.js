angular.module('starter.controllers', [])

.controller("List2Ctrl", function($scope, $stateParams, Medicine) {
  $scope.medName = Medicine.getName($stateParams.medID);

})

.controller("ListCtrl", function($scope, $ionicListDelegate,Medicines) {
  $scope.medicines = Medicines;
  $scope.addMed = function() {
    var name = prompt("Καταχωρήστε ένα νέο φάρμακο: ");
    var type = prompt("Είδος: ");
    var dosage = prompt("Δοσολογία: ");
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
/*
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
*/
.controller('MedDetailCtrl', function($scope, $stateParams, Medicine) {
//  $scope.chat = Chats.get($stateParams.chatId);
//  $scope.chat = getMedicine($stateParams.medicine.id);
//  $scope.chat = Medicine.all;

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
