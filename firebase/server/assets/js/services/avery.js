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

	var get_barrel_beers  =  function(){
	  var deferred = $q.defer();
		$http.get(APIURL  +  '/barrel-aged-beers')
		.success(function( data ){
			storage.barrel_beers = data.barrel_aged_beers;
			deferred.resolve( storage.barrel_aged_beers )
		})
		.error(function( e ){
			deferred.reject( e );
		})
		return deferred.promise;
	}


	var get_beers_in_fridge  =  function(){
	  var deferred = $q.defer();
		$http.get(APIURL  +  '/taproom/in-the-fridge')
		.success(function( data ){
			storage.beers_in_fridge = data.beer_list.beers;
			deferred.resolve( storage.beers_in_fridge )
		})
		.error(function( e ){
			deferred.reject( e );
		})
		return deferred.promise;
	}


	var get_beers_on_tap  =  function(){
	  var deferred = $q.defer();
		$http.get(APIURL  +  '/taproom/on-tap')
		.success(function( data ){
			storage.beers_on_tap = data.beer_list.beers;
			deferred.resolve( storage.beers_on_tap )
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
		get_beer_series 		: get_beer_series,
		get_barrel_beers 		: get_barrel_beers,
		get_beers_on_tap 		: get_beers_on_tap,
		get_beers_in_fridge : get_beers_in_fridge
	}

}])