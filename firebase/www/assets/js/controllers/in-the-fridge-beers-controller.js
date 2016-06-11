app.controller('fridgeBeersController', ['$scope', '$http', 'averyService', function($scope, $http, AS){

	$scope.title = 'Beers in the Fridge';

		// else Get the beers to list
		AS.get_beers_in_the_fridge().then(
			function( data ){
				$scope.beers = data;
			}, 
			function( error ){
			}
		)
/*
		
	}
*/
			
	
}])