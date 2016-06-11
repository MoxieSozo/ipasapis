app.controller('gamesController', ['$scope', '$state', function( $scope, $state ){
	$scope.games = [
		{'title' : 'Rochambeer', 'id' : 'games.farkle', 'icon' : 'rochambeer', 'desc' : 'Water boils Yeast. Yeast ferments Malt. Malt flavors Water.'},
		{'title' : 'Brew a Beer', 'id' : 'games.tapper', 'icon' : 'science', 'desc' : 'Gather all the ingredients to brew an Avery beer.'},
		{'title' : 'Beer Midi', 'id' : 'midi', 'icon' : 'midi', 'desc' : 'Channel your inner rockstar with the Avery Midi Player.'}
	]	
}])

