
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
/*
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('app', {
      url: "/",
      controller : 'adminController',
      templateUrl: "templates/admin.html"
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
*/
   });
app.constant('APIURL', 'http://apis.mondorobot.com/')
app.run(function(){
});

//---------------//
// appController // 
//---------------//
app.controller('appController', ['$rootScope', '$scope', '$http', '$firebaseAuth' , '$firebaseArray', '$firebaseObject' , 'averyService', '$timeout', 
	function( $rootScope, $scope, $http , $firebaseAuth, $firebaseArray, $firebaseObject , AS, $timeout){
	
	  var cRef = firebase.database().ref().child("challenge");
	  // download the data into a local object
	  var cSync = $firebaseObject(cRef);
	  // synchronize the object with a three-way data binding
	  // click on `index.html` above to see it used in the DOM!
	  cSync.$bindTo($scope, "challenge");


		
		$scope.add_challenge = function(){
			$scope.challenge.active_challenge = false;
			$scope.challenge.current_challenge = $scope.new_challenge;
			$scope.challenge_added = true;
			$scope.new_challenge = {};
			$timeout(function(){
				$scope.challenge_added = false;
				$scope.new_challenge = false;
			}, 2000)
		}

		$scope.end_challenge = function(){
			$scope.challenge.current_challenge = false;
			$scope.challenge.active_challenge = false;
			$scope.challenge_ended = true;
			$timeout(function(){
				$scope.challenge_ended = false;
				$scope.new_challenge = false;
			}, 2000)
		}
		
		$scope.remove_phone_number = function( $phone_number ){
			_.remove($scope.challenge.phone_numbers, function($phone){
				return $phone == $phone_number
			});
		}

		$scope.beers = [];
		// else Get the beers to list
		AS.get_beers_on_tap().then(
			function( data ){
				_.each(data, function(beer){
					beer.type = 'On Tap';
					$scope.beers.push(beer);
				})
				AS.get_beers_in_fridge().then(
					function( data ){
						$scope.beers_in_fridge = data;
						_.each(data, function(beer){
							beer.type = 'In Fridge';
							$scope.beers.push(beer);
						})
					}, 
					function( error ){
					}
				)
			}, 
			function( error ){
			}
		)


		$scope.beer_series = []
		AS.get_all_series().then(function( data ){
			$scope.beer_series = data
		})


		$scope.all_beers = []
		AS.get_all_beers().then(function( data ){
			$scope.all_beers = data
		})
		




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
		$(this).toggleClass('on');
		$('.menu').toggleClass('out');
	});
	$('.menu a').on('click', function(){
		$('.toggler').removeClass('on');
		$('.menu').addClass('out');
	});

}]);


