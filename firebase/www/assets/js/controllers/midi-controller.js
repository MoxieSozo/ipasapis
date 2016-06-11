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
	$scope.playing = false;

	// load the sound files + midi plugin
	$timeout(function(){
		$scope.sound_ready = false;
		// load the plugin 
		MIDI.loadPlugin({
			soundfontUrl: "assets/soundfont/",
			onprogress: function(state, progress) {
			},
			onsuccess: function() {
				$scope.sound_ready = true;
				$scope.$apply();
			}
		});
		
	})

	
	// get all of the beers on tap 
	// cause we like to drink avery on tap
	AS.get_beers_on_tap().then(
		function( data ){
			var notes = [];
			// foreach beer 
			// assign a note based on the abv
			// can't be more than 100 though 
			// and we don't want any duplicates
			_.each(AS.storage.beers_on_tap, function( beer ){
				beer.note = Math.floor(( beer.abv * 10) / 2);
				if(beer.note > 100) beer.note = 100;
				if(notes.indexOf(beer.note) == -1){
					notes.push(beer.note);
					beer.color = AS.beer_color( beer )
					
					beers_coll.push(beer);
				}
			})
			// sort them by abv
			beers_coll.sort(function( a , b ){
				return parseFloat(b.abv) - parseFloat(a.abv);
			})
			// assign and notify 
			$scope.beers = beers_coll;
			$scope.beers_ready = true;
		},
		function( error ){
			// should be doing something here
		}
	)

	// start recording
	// set a flag and create a song + timer for the notes
	$scope.start_recording = function(){
		$scope.recording = true;
		$scope.can_save = false;
		$scope.current_song = {'notes' : [], 'title' : '', 'id' : ''};
		var $something = 0;
		$scope.timer = $interval(function(){
			$scope.timeout+= 10;
		},10)
	}
	
	// stop recording
	// kill the timer 
	$scope.stop_recording = function(){
		$scope.recording = false;
		$scope.timeout = 0;
		$interval.cancel( $scope.timer );
		$scope.can_save = true;
	}

	// we want to play back the songs. 
	$scope.playback = function( song ){
		if(!$scope.playing){
			$scope.playing = true;
			_.each(song.notes, function( note, $i  ){
				if($scope.playing){
					if($i == 0)
						$scope.play_note( note.note , note.beer, true, note)
					$scope.playing = $timeout(function(){
						if($i !== 0)
							$scope.play_note( note.note , note.beer, true, note)
					}, note.timeout)
				}
			})
			$scope.playing = false;
		}
	}
	
	// good old stop method
	$scope.stopPlayback = function(){
		$scope.playing = false;
	}
	
	// save the song to our array.
	$scope.save_song = function(){
		$scope.songs.push($scope.current_song);
		$scope.current_song ={};
		$scope.can_save = false;
		$scope.showing_songs = true;
	}
	// show the list of songs
	$scope.show_songs = function(){
		$scope.showing_songs = $scope.showing_songs ? false : true;
	}


			
	// play the notes from playback 
	// and from the keyboard
	// the params need some retooling to be less messy here. 
	// note comes in as the note itself, not an object
	// playback means we want to turn the notes off too. 
	// the piece is for referencin	
	var $note_timer;
	var note_off = 0;
	$scope.play_note = function( note, beer, playback , piece){
		playback = typeof(playback) == 'undefined' ? false : playback
		if(!playback){
			note_off = 0;
			$note_timer = $interval(function(){
				note_off+=1;
			});
		}	
		if(playback)
			$('.header').animate({backgroundColor: "rgb("+ beer.color.r +","+ beer.color.g +"," +beer.color.b+")"})

		// play the note
		MIDI.setVolume(0, 180);
		MIDI.noteOn(0, note, 200, 0);
		// if we are playing back // we need to set the delay on te note off. 
		if(playback)
			MIDI.noteOff(0, note, piece.note_off + .5);
	}

	// release the note
	// on mouse up stop the delay timer, and save the note
	// if we are recording.. 
	$scope.release_note = function( note, beer ){
		$interval.cancel($note_timer)
		var delay = 0; // play one note every quarter second
		var note = note; // the MIDI note
		var velocity = 200; // how hard the note hits
		// record the notes if we are recording
		if($scope.recording){
			var piece = {
				timeout : $scope.timeout,
				delay : 0,
				note : note,
				beer : beer, 
				velocity : velocity,
				note_off : note_off
			};
			$scope.current_song.notes.push(piece);
		}
		MIDI.noteOff(0, note,.5);
	}

}])