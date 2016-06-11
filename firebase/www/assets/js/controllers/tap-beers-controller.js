app.controller('tapBeersController', ['$scope', '$http', 'averyService', function($scope, $http, AS){
/*
	// get the beer from storage if it is available
	if(typeof(AS.storage.beer_series) != 'undefined' ){
		$scope.beer_series = AS.storage.beer_series;
	}else{
*/


		// else Get the beers to list
		AS.get_beers_on_tap().then(
			function( data ){
				$scope.beers = data;
				console.log($scope.beers);
			}, 
			function( error ){
			}
		)
/*
		
	}
*/
			
	
}])