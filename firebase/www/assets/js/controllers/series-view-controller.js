app.controller('seriesViewController', ['$scope', '$http', 'averyService','$state',  function($scope, $http, AS, $state){
		
	AS.get_beer_series( $state.params.series_id).then(
		function( res ){
			$scope.series = res;
		},
		function( res ){
			
		}
	)

}])