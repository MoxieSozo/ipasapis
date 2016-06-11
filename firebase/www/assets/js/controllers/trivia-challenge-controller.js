app.controller('triviaChallengeController', ['$scope', '$http', 'averyService','$interval', '$state',  
	function($scope, $http, AS, $interval , $state ){

		try{
			$scope.challenge.current_challenge.phone_number == window.localStorage.phone_number;
		}catch( $e ){
			$state.go('/');
		}
			
		$scope.timer = 60;
		
		$scope.timer_clock = $interval(function(){
			if($scope.timer >= 0){
				$scope.timer -= 1;
			}else{
				$interval.cancel($scope.timer_clock);
				$scope.challenge.current_challenge.phone_number = false;
			}
		}, 1000)
		
		$scope.submit_answer = function(){
			$interval.cancel($scope.timer_clock);
			if($scope.challenge.current_challenge.answer.id == $scope.answer.id){
				$scope.challenge_won = true;
				$scope.challenge.current_challenge.active = false;
			}else{
				$scope.challenge_lost = true;
			}
			$scope.game_over = true;
		}
/*
	// get the beer from storage if it is available
	if(typeof(AS.storage.beer_series) != 'undefined' ){
		$scope.beer_series = AS.storage.beer_series;
	}else{
*/


		// else Get the beers to list
		AS.get_all_series().then(
			function( data ){
				$scope.series = data;
			}, 
			function( error ){
			}
		)
/*
		
	}
*/
			
	
}])