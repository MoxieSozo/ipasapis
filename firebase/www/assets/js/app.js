
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
      url: "/rochambeer",
      controller : 'farkleController',
      templateUrl: "templates/farkle.html"
    })
    .state('beers', {
      url: "/beers",
      controller : 'beersController',
      templateUrl: "templates/beers.html"
    })
    .state('beers-on-tap', {
      url: "/beers-on-tap",
      controller : 'tapBeersController',
      templateUrl: "templates/beers-on-tap.html"
    })
    .state('seriesView', {
      url: "/series/:series_id",
      controller : 'seriesViewController',
      templateUrl: "templates/series.view.html"
    })
    .state('midi', {
      url: "/midi",
      controller : 'midiController',
      templateUrl: "templates/midi.html"
    })
    .state('triviaChallenge', {
      url: "/trivia-challenge",
      controller : 'triviaChallengeController',
      templateUrl: "templates/trivia-challenge.html"
    })
     .state('games.tapper', {
      url: "/tapper",
      controller : 'tapperController',
      templateUrl: "templates/tapper.html"
    })
     .state('all_games', {
      url: "/all_games",
      controller : 'gamesController',
      templateUrl: "templates/all_games.html"
    })
   });
app.constant('APIURL', 'http://apis.mondorobot.com/')
app.run(function(){
});

//---------------//
// appController // 
//---------------//
app.controller('appController', ['$rootScope', '$scope', '$http', '$firebaseAuth' , '$firebaseArray', '$firebaseObject' , '$state', 
	function( $rootScope, $scope, $http , $firebaseAuth, $firebaseArray, $firebaseObject , $state){
	
	var $challengeRef = firebase.database().ref().child('challenge');
	
	var challengeSync = $firebaseObject($challengeRef);

	$scope.$watch('challenge', function(a, b){
		if(typeof(a)  != 'undefined' && typeof(a.current_challenge) != 'undefined' && a.current_challenge){
			if(confirm('Accept Challenge')){
				$scope.accept_challenge()
			}
		}
	}, true);
	
	
	
	$scope.accept_challenge = function(){
		var c = $scope.current_challenge;
		$scope.current_challenge = false; 
		$scope.active_challenge = c;
		$state.go('triviaChallenge')
	}

	

	
	challengeSync.$loaded(function(){
// 		alert(' new sync');
	})
	challengeSync.$bindTo($scope, 'challenge');



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
	$('.toggler').on('click', function(){
		$('.header').toggleClass('open');
		$('.menu').toggleClass('out');
	});
	$('.navbar-brand, .menu a').on('click', function(){
		$('.header').removeClass('open');
		$('.menu').addClass('out');
	});

}]);


