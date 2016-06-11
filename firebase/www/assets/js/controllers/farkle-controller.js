app.controller('farkleController', ['$scope', '$http', function( $scope, $http ){
	
	$('.rochambeer-controls i').on('click', function(){
		$('.rochambeer-controls i').removeClass('active');
		$(this).toggleClass('active');
		
		$('.choose').addClass('out');
		$('.my-choice, .their-choice, .vs').addClass('in');
		
		randomizer();
		
		var thisNum = $(this).attr('data-num');
		console.log(thisNum);
		if (thisNum == 1){
			$('.my-choice i').addClass('icon-water');
		} else if (thisNum == 2){
			$('.my-choice i').addClass('icon-yeast');
		} else {
			$('.my-choice i').addClass('icon-barley');
		}
	});
	
	
	function randomizer(){
		var num = Math.floor(Math.random() * 3) + 1 ;
		console.log(num);
		if( num == 1){
			$('.their-choice i').addClass('icon-water');
		} else if (num == 2){
			$('.their-choice i').addClass('icon-yeast');
		} else {
			$('.their-choice i').addClass('icon-barley');
		}
	}
	
}])