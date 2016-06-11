app.controller('midiController', ['$scope', '$http', '$timeout','averyService', '$interval', '$timeout' , 
	function($scope, $http, $timeout, AS, $interval, $timeout ){
	var beers_coll = [];	
	
	$scope.beers_ready = false;
	$scope.songs = [];
	$scope.current_loop = {};
	$scope.recording = false;
	$scope.timer = false
	$scope.timeout = 0;
	$scope.showing_songs = false;
	$scope.can_save = false;
	

	AS.get_all_beers().then(
		function( data ){
			beers_coll = AS.storage.all_beers;
			AS.get_barrel_beers().then(
				function( data ){
					_.each( AS.storage.barrel_beers , function( beer ){
							beers_coll.push( beer );
					})
					beers_coll.sort(function( a , b ){
						return parseFloat(b.abv) - parseFloat(a.abv);
					})
					_.each(beers_coll, function( beer ){
						beer.note = Math.floor(( beer.abv * 10) / 2);
						if(beer.note > 100) beer.note = 100;
					})
					$scope.beers = beers_coll;
					$scope.beers_ready = true;
				},
				function( error ){
				}
			)
		},
		function( error ){
		}
	)

		
	$scope.start_recording = function(){
		$scope.recording = true;
		$scope.can_save = false;
		$scope.current_song = {'notes' : [], 'title' : '', 'id' : ''};
		var $something = 0;
		$scope.timer = $interval(function(){
			$scope.timeout+= 10;
		},10)
	}

	$scope.stop_recording = function(){
		$scope.recording = false;
		$scope.timeout = 0;
		$interval.cancel( $scope.timer );
		$scope.can_save = true;
	}

	$scope.playback = function( song ){
		$scope.playing = true;
		_.each(song.notes, function( note ){
			if($scope.playing){
				$scope.playing = $timeout(function(){
					console.log( note )
					$scope.play_note( note.note )
				}, note.timeout)
			}
		})
	}
	
	$scope.stopPlayback = function(){
		$scope.playing = false;
	}
	
	$scope.save_song = function(){
		$scope.songs.push($scope.current_song);
	}
	
	$scope.show_songs = function(){
		$scope.showing_songs = $scope.showing_songs ? false : true;
	}
	
	$timeout(function(){
		
		$scope.sound_ready = false;
		// load the plugin 
		MIDI.loadPlugin({
			soundfontUrl: "assets/soundfont/",
			instrument: "acoustic_grand_piano",
			onprogress: function(state, progress) {
				//console.log(state, progress);
			},
			onsuccess: function() {
				$scope.sound_ready = true;
				$scope.$apply();
			}
		});
		
	})
	
	
		$scope.replay_note = function( note ){
			
		}

		$scope.play_note = function( note ){
			var delay = 0; // play one note every quarter second
			var note = note; // the MIDI note
			var velocity = 200; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
// 			MIDI.noteOff(0, note, delay + 0.75);

			// record the notes if we are recording
			if($scope.recording){
				$scope.current_song.notes.push({
					timeout : $scope.timeout,
					delay : 0,
					note : note,
					velocity : velocity
				});
			}
		
		}



	
}])


app.filter('floatToColor', [function(){
	return function(percentage){
    var color_part_dec = 255 * percentage;
    var color_part_hex = Number(parseInt( color_part_dec , 10)).toString(16);
    return "#" + color_part_hex + color_part_hex + color_part_hex;
   }

}])