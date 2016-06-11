app.controller('farkleController', ['$scope', '$http','$interval', '$timeout',  function( $scope, $http , $interval , $timeout){
	
	$scope.timer = false;
	$scope.playing = false;
	$scope.counting_down = false;
	$scope.countdown = 6;
	$scope.made_choice = false;
	
	$scope.score = {
		wins  	: 0,
		losses 	: 0,
		ties		: 0
	}
	
	
	$scope.choices = {
		 'water' 	: { 'id' : 1 	, 'icon' : 'water' 	, 'beats' : 'yeast'  	}, 	// water
		 'yeast' 	: {	'id' : 2 	, 'icon' : 'yeast'	, 'beats' : 'barley'  },	// malt
		 'barley' : { 'id' : 3	, 'icon' : 'barley'	, 'beats' : 'water' 	}, 	// yeast
	}
	
	
	$scope.play_game = function(){
		$interval.cancel($scope.timer);
		$('.choose').removeClass('out');
		$('.my-choice, .their-choice').removeClass('in');
		$('.my-choice i').removeClass('icon-water').removeClass('icon-barley').removeClass('icon-yeast');
		$('.their-choice i').removeClass('icon-water').removeClass('icon-barley').removeClass('icon-yeast');
		$('.rochambeer-controls i').removeClass('active');

		$scope.made_choice = false;
		$scope.message = '';
		$scope.game_over = false;
		$scope.countdown = 5;
		$scope.counting_down = true;

		$scope.timer = $interval(function(){
			$scope.countdown -= 1;
			if($scope.countdown === 0){
				$interval.cancel($scope.timer);
				$scope.playing = true;
				$scope.counting_down = false;
				if(!$scope.made_choice){
					$scope.time_ran_out = true;
					$scope.game_over = true;
					$scope.message = 'Time is Up!'
				}
			}
		}, 1000);
	}
	
	
		
	$('.rochambeer-controls i').on('click', function(){
		if($scope.counting_down ){
			$scope.made_choice = true;
			$scope.counting_down = false;
			$('.rochambeer-controls i').removeClass('active');
			$(this).toggleClass('active');
			
			$('.choose').addClass('out');
			$('.my-choice, .their-choice, .vs').addClass('in');
			
			var theirchoice = randomizer();
			
			var thisNum = $(this).attr('data-num');
			var mychoice = '';
			
			if (thisNum == 1){
				$('.my-choice i').addClass('icon-water');
				mychoice = $scope.choices.water;
			} else if (thisNum == 2){
				$('.my-choice i').addClass('icon-yeast');
				mychoice = $scope.choices.yeast;
			} else if (thisNum == 3){
				$('.my-choice i').addClass('icon-barley');
				mychoice = $scope.choices.barley;
			}
			

			
			$timeout(function(){

				if(mychoice.beats == theirchoice.icon){
					$scope.message = 'You Win!';
					$scope.wins+=1;
				}else if(theirchoice.beats == mychoice.icon){
					$scope.message = 'You Lose!';
					$scope.losses +=1;
				}else if(mychoice.icon == theirchoice.icon){
					$scope.message = 'Tie!';
					$scope.ties +=1;
				}
				$scope.game_over = true;
			}, 1000)
		}
	});
	
	
	function randomizer(){
		var num = Math.floor(Math.random() * 3) + 1 ;
		var choice ;
		if( num == 1){
			$('.their-choice i').addClass('icon-water');
			choice = $scope.choices.water;
		} else if (num == 2){
			$('.their-choice i').addClass('icon-yeast');
			choice = $scope.choices.yeast;
		} else if (num == 3){
			$('.their-choice i').addClass('icon-barley');
			choice = $scope.choices.barley;
		}
		return choice;
	}
	
	
}])