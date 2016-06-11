app.service('averyService', ['$rootScope','$http', 'APIURL', '$q',  function($rootScope, $http, APIURL, $q){
	
	var storage = { 'series' : [] };
	
	// get all beers
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

	// get barrel beers
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

	//get beeres on tap
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

	// beers in the fridge
	var get_beers_in_the_fridge  =  function(){
	  var deferred = $q.defer();
		$http.get(APIURL  +  '/taproom/in-the-fridge')
		.success(function( data ){
			storage.beers_in_the_fridge = data.beer_list.beers;
			deferred.resolve( storage.beers_in_the_fridge )
		})
		.error(function( e ){
			deferred.reject( e );
		})
		return deferred.promise;
	}


	
		
	
	// get all series
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
	
	// get beers in a series
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
	// get beer filters
	var get_beer_filters  =  function(){
	  var deferred = $q.defer();
		$http.get(APIURL  +  '/beer-filters')
		.success(function( data ){
			storage.beer_filters = data;
			deferred.resolve( storage.beer_filters )
		})
		.error(function( e ){
			deferred.reject( e );
		})
		return deferred.promise;
	}
	
	// beers by filter
	var get_beers_by_filter  =  function( filter ){
	  var deferred = $q.defer();
		$http.get(APIURL  +  '/beers?categories='+filter)
		.success(function( data ){
			storage.filtered_beers = data;
			deferred.resolve( storage.filtered_beers )
		})
		.error(function( e ){
			deferred.reject( e );
		})
		return deferred.promise;
	}
	
	// beer color ( by label ) 
	var beer_color  = function( beer ){
		
		var colors = {
			'callipygian' 							: {r : '44' , g : '35', b : '36'},
			'uncle-jacob-s-stout' 			: {r : '64' , g : '34', b : '30'},
			'samael-s' 									: {r : '232' , g : '0', b : '21'},
			'pump-ky-n'									: {r : '194', g : '50', b : '24'},
			'xolotl' 										: {r : '32', g : '92', b : '57'},
			'vanilla-bean-stout' 				: {r : '63', g : '138', b : '68'},
			'the-maharaja'							: {r : '47', g : '80', b : '45'},
			'the-reverend'							: {r : '239', g : '129', b : '41'},
			'hog-heaven'								: {r : '242', g : '202', b : '194'},
			'baltic-porter'							: {r : '195', g : '125', b : '65'},
			'raja'											: {r : '164', g : '15', b : '21'},
			'twenty-three-anniversary'	: {r : '115', g : '43', b : '18'},
			'eremita-ix'								: {r : '163', g : '183', b : '172'},
			'perzik-saison'							: {r : '174', g : '56', b : '54'},
			'karma-sutra'								: {r : '205', g : '6', b : '13'},
			'goat-candy'								: {r : '21', g : '9', b : '13'},
			'white-rascal'							: {r : '169', g : '10', b : '27'},
			'liliko-i-kepolo'						: {r : '10', g : '83', b : '25'},
			'quivering-lip'							: {r : '99', g : '24', b : '23'},
			'joe-s-pils'								: {r : '157', g : '147', b : '135'},
			'el-gose'										: {r : '242', g : '138', b : '32'},
		}
		
		if(	typeof(	colors[	beer.id	]	) !== 'unedfined')  return colors[beer.id];
		
		return {
			r : parseFloat(beer.price_per_growler) * 10,
			b : parseFloat(beer.price_per_glass) * 10,
			g : parseFloat(beer.abv) * 10
		}
		
	}
	
	return {
		storage									: storage, 
		get_all_beers 					: get_all_beers,
		get_all_series 					: get_all_series,
		get_beer_series 				: get_beer_series,
		get_beer_filters				: get_beer_filters,
		get_barrel_beers 				: get_barrel_beers,
		get_beers_on_tap 				: get_beers_on_tap,
		get_beers_by_filter 		: get_beers_by_filter,
		beer_color 							: beer_color,
		get_beers_in_the_fridge	: get_beers_in_the_fridge
	}

}])