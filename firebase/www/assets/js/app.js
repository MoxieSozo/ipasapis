
var app = angular.module('apipaApp', [ 'ui.router', 'firebase']);

app.run(['$rootScope', function( $rootScope ){
  var config = {
    apiKey: "AIzaSyAWMNtJ6BVc7XR1BRWUMzU4yPVCittoyqE",
    authDomain: "project-2372542451830160777.firebaseapp.com",
    databaseURL: "https://project-2372542451830160777.firebaseio.com",
    storageBucket: "project-2372542451830160777.appspot.com",
  };
  console.log(config);
  firebase.initializeApp(config);

}])
// routes
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('app', {
      url: "/",
      controller : 'homeController',
      templateUrl: "templates/home.html"
    })
    .state('games', {
      url: "/games",
      controller : 'gamesController',
      templateUrl: "templates/games.html"
    })
    .state('games.farkle', {
      url: "/games/rochambeer",
      controller : 'farkleController',
      templateUrl: "templates/farkle.html"
    })
     .state('games.tapper', {
      url: "/games/tapper",
      controller : 'tapperController',
      templateUrl: "templates/tapper.html"
    })
   });
app.run(function(){
});

//---------------//
// appController // 
//---------------//
app.controller('appController', ['$scope', '$http', '$firebaseAuth' , function( $scope, $http , $firebaseAuth){

/*

  var auth = $firebaseAuth();
  console.log(auth.$getAuth());
  

  // login with Facebook
  auth.$signInWithPopup("google").then(function(authData) {
	  console.log(authData);
    console.log("Logged in as:", authData.uid);
  }).catch(function(error) {
    console.log("Authentication failed:", error);
  });
*/

}]);


