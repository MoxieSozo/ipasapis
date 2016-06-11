app.controller('midiController', ['$scope', '$http', '$timeout','averyService',  function($scope, $http, $timeout, AS){
	
	
	AS.get_all_beers().then(
		function( data ){
			$scope.beers = data;			


			AS.get_barrel_beers().then(
				function( data ){
					$scope.barrel_beers = AS.storage.barrel_beers
				},
				function( error ){
				}
			)

		},
		function( error ){
			
		}
	)

		
	$scope.loops = [];
	$scope.current_loop = {};
	$scope.recording = false;
	
	$timeout(function(){
		
		$scope.sound_ready = false;
		// load the plugin 
		MIDI.loadPlugin({
			soundfontUrl: "assets/soundfont/",
			instrument: "acoustic_grand_piano",
			onprogress: function(state, progress) {
				console.log(state, progress);
			},
			onsuccess: function() {
				$scope.sound_ready = true;
				$scope.$apply();
			}
		});
		
		
		$scope.play_note = function(){
				var delay = 0; // play one note every quarter second
				var note = 1; // the MIDI note
				var velocity = 127; // how hard the note hits
				// play the note
				MIDI.setVolume(0, 127);
				MIDI.noteOn(0, note, velocity, delay);
				MIDI.noteOff(0, note, delay + 0.75);
			
		}
		
	
	})
	
}])