app.controller('tapBeersController', ['$scope', '$http', 'averyService', function($scope, $http, AS){

	$scope.title = 'Beers on Tap';

	$scope.laoding = true;
	$scope.bottles_done = false;
	$scope.tap_done = false;

	$scope.$on('loading_done', function(event, params){
		if(params.type == 'bottles'){
			$scope.bottles_done = true;
		}
		if(params.type == 'tap')
			$scope.tap_done = true;
		if($scope.bottles_done && $scope.tap_done)
			$scope.loading = false;
	})
	
	$scope.loading = true;
		// else Get the beers to list
		AS.get_beers_on_tap().then(
			function( data ){
				$scope.beers = data;
				$scope.$emit('loading_done', {'type' : 'tap'});
			}, 
			function( error ){
			}
		)

		// else Get the beers to list
		AS.get_beers_in_the_fridge().then(
			function( data ){
				$scope.bottle_beers = data;
				$scope.$emit('loading_done', {'type' : 'bottles'});
			}, 
			function( error ){
			}
		)

			
	
}])