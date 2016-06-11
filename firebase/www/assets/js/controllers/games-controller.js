app.controller('gamesController', ['$scope', '$state', function( $scope, $state ){
	$scope.games = [
		{'title' : 'Rochambeer', 'id' : 'games.farkle'},
		{'title' : 'Brew a Beer', 'id' : 'games.tapper'},
		{'title' : 'Beer Midi', 'id' : 'midi'}
	]	
}])

