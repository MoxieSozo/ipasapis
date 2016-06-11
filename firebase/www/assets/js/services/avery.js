app.service('averyService', ['$rootScope','$http', 'APIURL', '$q',  function($rootScope, $http, APIURL, $q){
	
	var storage = { 'series' : [] };
	
	var get_all_beers  =  function(){
	  var deferred = $q.defer();
		$http.get(APIURL  +  '/beers')
		.success(function( data ){
			storage.all_beers = data.beers;
			deferred.resolve( storage.all_beers )
		})
		.error(function( e ){
			deferred.reject( e );
		})
		return deferred.promise;
	}
	

	var get_all_series  =  function(){
	  var deferred = $q.defer();
		$http.get(APIURL  +  '/beer-series')
		.success(function( data ){
			storage.beer_series = data.beer_series;
			deferred.resolve( storage.beer_series )
		})
		.error(function( e ){
			deferred.reject( e );
		})
		return deferred.promise;
	}
	
	var get_beer_series  = function( series_id ){
	  var deferred = $q.defer();
		$http.get(APIURL + '/beer-series/' +  series_id  )
			.success(function( data ){
				storage.series[series_id] = data.beer_series;
				deferred.resolve( storage.series[series_id] )
			})
			.error(function( e ){
				deferred.rejec( e );
			})
			return deferred.promise;
			
	}
	
	return {
		storage							: storage, 
		get_all_beers 			: get_all_beers,
		get_all_series 			: get_all_series,
		get_beer_series 		: get_beer_series
	}

}])