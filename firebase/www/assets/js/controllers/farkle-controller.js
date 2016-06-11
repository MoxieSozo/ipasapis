app.controller('farkleController', ['$scope', '$http', function( $scope, $http ){
	
	$('.rochambeer-controls i').on('click', function(){
		$('.rochambeer-controls i').removeClass('active');
		$(this).toggleClass('active');
	});
	
}])