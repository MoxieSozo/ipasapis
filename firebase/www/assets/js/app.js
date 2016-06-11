var app = angular.module('apipaApp', [ 'ui.router', 'firebase']);

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


//---------------//
// appController // 
//---------------//
app.controller('appController', ['$rootScope', '$scope', '$http', '$firebaseAuth' , '$firebaseArray', '$firebaseObject' , '$state', 
	function( $rootScope, $scope, $http , $firebaseAuth, $firebaseArray, $firebaseObject , $state){

/*
		var declined_challenge = typeof(window.localStorage.declined_challenge) !== 'undefined' ? window.localStorage.declined_challenge : false;	
		if(!declined_challenge){		
*/
			var localPhone = typeof(window.localStorage.phone_number) == 'undefined' ? false : window.localStorage.phone_number;
	
			var $challengeRef = firebase.database().ref().child('challenge');
			
			var challengeSync = $firebaseObject($challengeRef);
		
			challengeSync.$bindTo($scope, 'challenge');
			
			challengeSync.$loaded(function(){
				var challenge_numbers = typeof($scope.challenge.phone_numbers) == 'undefined' ? [] : $scope.challenge.phone_numbers
				
				// watch for changes to the challenge/
				// if something comes in. let the user know
				$scope.$watch('challenge', function(a, b){
					
					if(	typeof(a)  != 'undefined' 
						&& typeof(a.current_challenge) != 'undefined' 
						&& a.current_challenge 
						&& a.current_challenge.active != false ){
							// the user has already played
							if(localPhone && challenge_numbers.indexOf(localPhone) !== -1 ){
								return;
							}
							
							if( (typeof($scope.challenge.current_challenge.phone_number) == 'string' 
								&& $scope.challenge.current_challenge.phone_number !== localPhone )){
								return 
							}
							$('[ui-view]').before('#accept-challenge')/*
.css({
									'opacity': '1', 
									'-webkit-transform': 'translateX(0)', 
									'-moz-transform': 'translateX(0)', 
									'transform': 'translateX(0)'
								}).fadeIn();
*/
							$scope.show_challenge_modal = true;
					}
				}, true);
			})
		
			
			// user is accepting the challenge. 
			$scope.accept_challenge = function(){
				window.localStorage.phone_number = $scope.accept_with_phone;
				if(typeof($scope.challenge.phone_numbers)== 'undefined') $scope.challenge.phone_numbers = []
				if($scope.challenge.phone_numbers.indexOf($scope.accept_with_phone) !== -1){
					alert('It looks like you already played today. Try back again tomorrow');
					$scope.show_challenge_modal = false;
				}else{
					$scope.challenge.current_challenge.phone_number = $scope.accept_with_phone;
					$scope.challenge.phone_numbers.push($scope.accept_with_phone);
					window.localStorage.phone_number =  $scope.accept_with_phone;
					$scope.show_challenge_modal = false;
					$('#accept-challenge').remove();
					$state.go('triviaChallenge');
		
				}
			}
		
			$scope.decline_challenge = function(){
				window.localStorage.declined_challenge = true;
				$('#accept-challenge').remove();
			}
// 		}
	




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
	
	if(window.innerHeight < window.innerWidth){
		$('body').addClass('landscape');
	} else { 
		$('body').removeClass('landscape');
	}
	window.addEventListener("orientationchange", function() {
		if(window.innerHeight < window.innerWidth){
		    $('body').addClass('landscape');
		} else { 
			$('body').removeClass('landscape');
		}
	}, false);

}]);


