app.controller('triviaChallengeController', ['$scope', '$http', 'averyService','$interval', '$state', '$timeout',  
	function($scope, $http, AS, $interval , $state , $timeout ){

		// should this user be playing the game / 
		// Is is their game to play
		try{
			$scope.challenge.current_challenge.phone_number == window.localStorage.phone_number;
		}catch( $e ){
			$state.go('/');
		}
		
		// they have	60 seconds to play 		
		// set a countdown clock. 
		$scope.timer = 60;
		$scope.timer_clock = $interval(function(){
			if($scope.timer >= 0){
				$scope.timer -= 1;
			}else{
				$interval.cancel($scope.timer_clock);
				$scope.challenge.current_challenge.phone_number = false;
			}
		}, 1000)
		
		// submit the users answer
		// if they are right. show the answer 
		// if they are wrong. let them know
		// they can only play once. 
		$scope.submit_answer = function(){
			$interval.cancel($scope.timer_clock);
			if($scope.challenge.current_challenge.answer.id == $scope.answer.id){
				$scope.challenge_won = true;
				$scope.challenge.current_challenge.active = false;
			}else{
				$scope.challenge_lost = true;
/*
				$timeout(function(){
					$state.go('/')
				})
*/
			}
			$scope.game_over = true;
		}
		
}])