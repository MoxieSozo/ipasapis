app.controller('triviaChallengeController', ['$scope', '$http', 'averyService','$interval',  
	function($scope, $http, AS, $interval ){

	
		$scope.timer = 60;
		
		$scope.timer_clock = $interval(function(){
			if($scope.timer >= 0){
				$scope.timer -= 1;
			}else{
				$interval.cancel($scope.timer_clock);
			}
			console.log($scope.timer);
		}, 1000)
		
		$scope.submit_answer = function(){
			if($scope.challenge.current_challenge.answer.id == $scope.answer.id){
				alert('you won')
				$scope.challenge_won = true;
			}else{
				alert( 'you lost')
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