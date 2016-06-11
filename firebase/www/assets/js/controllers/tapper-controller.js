app.controller('tapperController', ['$scope', '$http', 'averyService', function( $scope, $http, averyService ){
	
	$scope.recipe = { hops: 0, grains: 0, yeast: false, processing: false };
	
	
	var game;
	var player;
	var platforms;
	var clouds;
	var buildings;
	var cursors;
	var beers;
	var hops;
	var grains; 
	var yeasts; 
	var water; // todo
	var heat; // todo
	var processor; 
	var lever;
	var lvr;
	var yourBrew; // todo
	var yourBrewText; // todo
	var interact = false;
	var left = false;
	var right = false;
	var up = jump = false;
	var nextJump = 0;
	var drop = false;
	var hopTotal = 0; // score
	var hopText; // scoreText
	var grainTotal = 0;
	var grainText;
	var hasYeast = false;
	var processorText;
	
	
	
	
	averyService.get_all_beers().then( function(b){
		beers = b;
		play_tapper();
	});
	
	
	
	$scope.$watch('recipe', function(a, b){
		console.log(a, b);
		
		if( a.processing && !b.processing ) {
			
		}
		
	}, true)
	

	
	
	function play_tapper() {
		game = new Phaser.Game(1184, 667, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
		console.log(beers);
	}
	
		
		
		
	/**
	 * preload function.
	 * 
	 * @access public
	 * @return void
	 */
	function preload() {
	
		game.load.image('sky', 		'assets/img/tapper/videogame-retina.jpg');
		game.load.image('concrete', 	'assets/img/tapper/platform-red.png');
		game.load.image('ground', 	'assets/img/tapper/platform-red.png');
		game.load.image('clouds', 	'assets/img/tapper/clouds-dark.png');
		//game.load.image('city', 	'assets/img/tapper/city.png');
		game.load.image('tree', 	'assets/img/tapper/tree.png');
		game.load.image('hop', 		'assets/img/tapper/hop.svg');
		game.load.image('grain', 		'assets/img/tapper/grain.svg');
		game.load.image('yeast', 		'assets/img/tapper/yeast.svg');
		//game.load.image('water', 		'assets/img/tapper/hop.svg');
		//game.load.image('flower', 		'assets/img/tapper/hop.svg');
		game.load.image('processor', 		'assets/img/tapper/tank.png');
		game.load.image('silo', 		'assets/img/tapper/silos.svg');
		
		
		// what else to add
		game.load.spritesheet('dude', 'assets/img/tapper/drinker.png', 32, 48);
		game.load.spritesheet('lever', 'assets/img/tapper/control-sprite.png', 85, 85);
		game.load.spritesheet('buttonright', 'assets/img/tapper/ui-right.png',150,150);
		game.load.spritesheet('buttonleft', 'assets/img/tapper/ui-left.png',150,150);
		game.load.spritesheet('buttoninteract', 'assets/img/tapper/ui-interact.png',150,150);
		game.load.spritesheet('buttonjump', 'assets/img/tapper/ui-jump.png', 150,150);
		
		//full screen
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	
	}
	
	
	
	/**
	 * create function.
	 * 
	 * @access public
	 * @return void
	 */
	function create() {
		//if (!game.device.desktop){ game.input.onDown.add(gofull, this); } //go fullscreen on mobile devices
		
		
		//	We're going to be using physics, so enable the Arcade Physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.y = 900;
	
				
		//	A simple background for our game
		var sky = game.add.sprite(0,70, 'sky');
		sky.scale.x = .9;
		sky.scale.y = .75;
		
/*
		clouds = game.add.group();
		clouds.enableBody = false;
		var cloud1 = clouds.create(900, 120, 'clouds');
		var cloud_inMotion = game.add.tween(cloud1);
		cloud_inMotion.to({ x: -200 }, 30000, 'Linear', true, 0);
*/

		
		//	The platforms group contains the ground and the 2 ledges we can jump on
		platforms = game.add.group();
		platforms.enableBody = true;
		
		
		
		// Here we create the ground.
		var ground = platforms.create(0, game.world.height - 150, 'ground');
		ground.scale.setTo(6, 5);
		ground.body.immovable = true;
	
		//	Ledges
		var ledge = platforms.create(400, 400, 'concrete');
		ledge.body.immovable = true;
		ledge = platforms.create(-150, 250, 'concrete');
		ledge.body.immovable = true;
		
		// Silo and buildings
		buildings = game.add.group();
		buildings.enableBody = true;
		//var silo = buildings.create(960, 300, 'silo');
		
		silo = game.add.sprite(960,290, 'silo');
		//silo.scale.setTo(.125,.125);
		//var city = buildings.create(700, 200, 'city');
		
		// Process
		processor = game.add.group();
		processor.enableBody = true;
		// create the processor
		
		var machine = processor.create(30, 280, 'processor');
		machine.scale.setTo(.75,.75);
		machine.body.collideWorldBounds = true;
	
		machine.body.gravity.y = 800;
		machine.body.bounce.y = .1;
		
		lvr = processor.create(145, 432, 'lever');
		lvr.body.collideWorldBounds = true;
		lvr.animations.add('activate', [0, 2, 4], 10, false);
	
		processorText = game.add.text(300, 600, 'Collect ingredients to brew a beer', { fontSize: '24px', fill: '#FFF' });
		
		setTimeout(function() {
			processorText.text = '';

		}, 3000)
		
/*
		lever = game.add.sprite(145,432 , 'lever');
		
		lever.animations.add('activate', [1, 3, 5], 10, true);
		
*/
		
		// The player aka brewer
		player = game.add.sprite(450, game.world.height - 200, 'dude');
	
		//	We need to enable physics on the player
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 600;
		player.body.collideWorldBounds = true;
		
		
		//	Walking animations
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
	
	
		/* 
		**
		** INGREDIENTS	
		**
		**
		*/
		
		//	Hops
		hops = game.add.group();
		hops.enableBody = true;
		for (var i = 0; i < 4; i++)
		{
			var ran = Math.floor(Math.random() * 29);
			//var hop = hops.create( (i+1.2) * 3 * ran + (100 * ran), 100, 'hop');
			var hop = hops.create( (i * 100) + (10 * ran ), 100, 'hop');
	
			//	Let gravity do its thing
			hop.body.gravity.y = 900;
	
			//	This just gives each hop a slightly random bounce value
			hop.body.bounce.y = 0.1 + Math.random() * 0.2;
		}
		hopText = game.add.text(16, 16, 'Hops Collected: 0', { fontSize: '32px', fill: '#FFF' });

		// Grains
		grains = game.add.group();
		grains.enableBody = true;
		for (var i = 0; i < 4; i++)
		{
			//	Create a star inside of the 'stars' group
			var grain = grains.create(i * 82 + 690, 452, 'grain');
	
			//	Let gravity do its thing
			grain.body.gravity.y = 100;
			grain.body.bounce.y = 0.1 + Math.random() * 0.01;
		}
		grainText = game.add.text(16, 48, 'Grains Collected: 0', { fontSize: '32px', fill: '#FFF' });
		
		// Yeast
		yeasts = game.add.group();
		yeasts.enableBody = true;
		// create the grains
		for (var i = 0; i < 9; i++)
		{
			var ran = Math.floor(Math.random() * 100 );
			var yeast = yeasts.create( (2 * ran ) * 2 + 100, (i * ran ) * 2 + 5, 'yeast');
	
			//	Let gravity do its thing
			yeast.body.gravity.y = ran * .1;
			yeast.body.bounce.y = 0.1 + Math.random() * 0.01;
			yeast.scale.setTo(.3,.3);
		}
		yeastText = game.add.text(16, 80, 'Yeast Collected: No', { fontSize: '32px', fill: '#FFF' });
		
		
		
		
		
		
		

		//	Our controls
		// Desktop / keyboard
		cursors = game.input.keyboard.createCursorKeys();
		
		// mobile buttons
		build_buttons();			   
	 
		
	}
	
	function update() {
		//	Collide the player and the hops with the platforms
		game.physics.arcade.collide(player, platforms);
		game.physics.arcade.collide(hops, platforms);
		game.physics.arcade.collide(grains, platforms);
		game.physics.arcade.collide(yeasts, platforms);
		//game.physics.arcade.collide(flower, platforms);
		//game.physics.arcade.collide(water, platforms);
		game.physics.arcade.collide(processor, platforms);
		game.physics.arcade.collide(buildings, platforms);
	
		//	Checks to see if the player overlaps with any of the hops, if he does call a function
		game.physics.arcade.overlap(player, hops, collectHop, null, this);
		game.physics.arcade.overlap(player, grains, collectGrain, null, this);
		game.physics.arcade.overlap(player, yeasts, collectYeast, null, this);
		game.physics.arcade.overlap(player, processor, processIngredients, null, this);
		//game.physics.arcade.overlap(player, lever, processIngredients, null, this);
	
		//	Reset the players velocity (movement)
		player.body.velocity.x = 0;
		
		
		if (cursors.left.isDown || left )
		{
			//	Move to the left
			player.body.velocity.x = -150;
	
			player.animations.play('left');
			
/*
			setTimeout( function() {
				processorText.scale.setTo(0,0);
			}, 1500 );
*/
		}
		else if (cursors.right.isDown || right )
		{
			//	Move to the right
			player.body.velocity.x = 150;
			player.animations.play('right');
			
/*
			setTimeout( function() {
				processorText.scale.setTo(0,0);
			}, 1500 );
*/
			
		}
		else
		{
			//	Stand still
			player.animations.stop();
	
			player.frame = 4;
		}
		
		//	Allow the player to jump if they are touching the ground.
		if ( (cursors.up.isDown && player.body.touching.down) ||  jump )
		{
			jump_now();
		}
		
		
		if( interact || cursors.down.isDown ) {
			
				
			if( right || cursors.right.isDown  ) {
				player.frame = 9;
			} else  {
				player.frame = 10;
			}
			
		}
	
		
		if (game.input.currentPointers == 0 && !game.input.activePointer.isMouse){ jump=false; left=false; right=false; } //this works around a "bug" where a button gets stuck in pressed state
	
	}
	
	
	/**
	 * collectHop function.
	 * 
	 * @access public
	 * @param mixed player
	 * @param mixed hop
	 * @return void
	 */
	function collectHop (player, hop) {
		
		if( interact || cursors.down.isDown ) {
			
			// Removes the hop from the screen
			hop.kill();
		
			//	Add and update the score
			hopTotal += 1;
			hopText.text = 'Hops Collected: ' + hopTotal;
			$scope.recipe.hops = hopTotal;
			$scope.$apply();
			console.log($scope.recipe.hops);

			
		}
					
	}
	
	/**
	 * collectGrain function.
	 * 
	 * @access public
	 * @param mixed player
	 * @param mixed grain
	 * @return void
	 */
	function collectGrain (player, grain) {
		
		if( interact || cursors.down.isDown ) {
			grain.kill();
		
			//	Add and update the score
			grainTotal += 1;
			grainText.text = 'Grains Collected: ' + grainTotal;
			$scope.recipe.grains = grainTotal;
			$scope.$apply();
			console.log($scope.recipe);
		}
	}
	
	
	/**
	 * collectYeast function.
	 * 
	 * @access public
	 * @param mixed player
	 * @param mixed yeast
	 * @return void
	 */
	function collectYeast (player, yeast) {
		
		if( interact || cursors.down.isDown ) {
			yeast.kill();
			
			// Removes the hop from the screen
			if( !hasYeast ) {
				
				//	Add and update the score
				hasYeast = true;
				yeastText.text = 'Yeast Collected: Yes';
				$scope.recipe.yeast = true;
				$scope.$apply();
				console.log($scope.recipe);
			}
		}
	
	}
	
	function processIngredients() {
		
		if( interact || cursors.down.isDown ) {
			var canProcess = true;
		
			$.each($scope.recipe, function(k,v) {
				//console.log(k,v);
				if( !v && k !== 'processing' ) {
					canProcess = false;
				}
			});
			
			
			if( $scope.recipe.processing !== true && canProcess == true ) {
				
				processorText.text = 'Ingredients added.  Time to Brew! ';
				//processorText.fontSize = '36px'; //, fill: '#F00' 
				
				//lvr.animations.play('activate');
				lvr.animations.play('activate');
				
				
				$scope.recipe.processing = true;
				$scope.$apply();
				
				setTimeout(function() {
					var ran = Math.floor(Math.random() * beers.length );
					
					processorText.text = 'You brewed: ' + beers[ran].name;
				
				}, 500);
				
				
			} else {
				processorText.text = 'More ingredients needed. ';
				
				
			}

		}
				
		
	}
	
	
	/**
	 * gofull function.
	 * 
	 * @access public
	 * @return void
	 */
	function gofull() { game.scale.startFullScreen(false); }
	
	
	/**
	 * jump_now function.
	 * 
	 * @access public
	 * @return void
	 */
	function jump_now(){	//jump with small delay
		if (game.time.now > nextJump ){
			player.body.velocity.y = -450;
			nextJump = game.time.now + 1500;
		}
	}
	
	function build_buttons() {
		var buttonPos = {
			jump: [900,575],
			left: [50,575],
			right: [150,575],
			interact: [800,575]
		};
		
		
		// jump
		buttonjump = game.add.button(buttonPos.jump[0], buttonPos.jump[1], 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		buttonjump.fixedToCamera = true;	 //our buttons should stay on the same place  
		buttonjump.events.onInputOver.add(function(){jump=true;});
		buttonjump.events.onInputOut.add(function(){jump=false;});
		buttonjump.events.onInputDown.add(function(){jump=true;});
		buttonjump.events.onInputUp.add(function(){jump=false;});
		buttonjump.scale.x = 0.5;
		buttonjump.scale.y = 0.5;	
		
		
		//left
		buttonleft = game.add.button(buttonPos.left[0], buttonPos.left[1], 'buttonleft', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		buttonleft.fixedToCamera = true;	 //our buttons should stay on the same place  
		buttonleft.events.onInputOver.add(function(){left=true;});
		buttonleft.events.onInputOut.add(function(){left=false;});
		buttonleft.events.onInputDown.add(function(){left=true;});
		buttonleft.events.onInputUp.add(function(){left=false;});
		buttonleft.scale.x = 0.5;
		buttonleft.scale.y = 0.5;
		
		//right
		buttonright = game.add.button(buttonPos.right[0], buttonPos.right[1], 'buttonright', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		buttonright.fixedToCamera = true;  //our buttons should stay on the same place  
		buttonright.events.onInputOver.add(function(){right=true;});
		buttonright.events.onInputOut.add(function(){right=false;});
		buttonright.events.onInputDown.add(function(){right=true;});
		buttonright.events.onInputUp.add(function(){right=false;});
		buttonright.scale.x = 0.5;
		buttonright.scale.y = 0.5;
		
		//right
		buttoninteract = game.add.button(buttonPos.interact[0], buttonPos.interact[1], 'buttoninteract', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		buttoninteract.fixedToCamera = true;  //our buttons should stay on the same place  
		buttoninteract.events.onInputOver.add(function(){interact=true;});
		buttoninteract.events.onInputOut.add(function(){interact=false;});
		buttoninteract.events.onInputDown.add(function(){interact=true;});
		buttoninteract.events.onInputUp.add(function(){interact=false;});
		buttoninteract.scale.x = 0.5;
		buttoninteract.scale.y = 0.5;

	} 

	
}])