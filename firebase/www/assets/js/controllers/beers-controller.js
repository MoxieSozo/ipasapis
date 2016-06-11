app.controller('beersController', ['$scope', '$http', 'averyService', function($scope, $http, AS){
		// else Get the beers to list
		AS.get_all_series().then(
			function( data ){
				$scope.series = data;
			}, 
			function( error ){
			}
		)
	
}])