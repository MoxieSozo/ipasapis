app.controller('tapperController', ['$scope', '$http', 'averyService', function( $scope, $http, averyService ){
	
	$scope.recipe = [];
	
	
	var game;
	var player;
	var platforms;
	var clouds;
	var cursors;
	var beers;
	var hops;
	var left = false;
	var right = false;
	var up = jump = false;
	var nextJump = 0;
	var drop = false;
	var hopTotal = 0; // score
	var hopText; // scoreText
	
	
	averyService.get_all_beers().then( function(b){
		beers = b;
		play_tapper();
	});
	
	
	

	
	
	function play_tapper() {
		game = new Phaser.Game(1200, 680, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
		console.log(beers);
	}
	
	
	
		
		
		
	/**
	 * preload function.
	 * 
	 * @access public
	 * @return void
	 */
	function preload() {
	
		game.load.image('sky', 		'assets/img/tapper/sky.png');
		game.load.image('ground', 	'assets/img/tapper/platform.png');
		game.load.image('clouds', 	'assets/img/tapper/clouds.png');
		game.load.image('city', 	'assets/img/tapper/city.png');
		game.load.image('tree', 	'assets/img/tapper/tree.png');
		game.load.image('hop', 		'assets/img/tapper/hop.svg');
		
		
		// what else to add
		game.load.spritesheet('dude', 'assets/img/tapper/drinker.png', 32, 48);
		
		game.load.spritesheet('buttonright', 'assets/img/tapper/ui-right.png',150,150);
		game.load.spritesheet('buttonleft', 'assets/img/tapper/ui-left.png',150,150);
		//game.load.spritesheet('buttondiagonal', 'assets/img/tapper/button.svg',120,120);
		//game.load.spritesheet('buttonfire', 'assets/img/tapper/button.svg',120,120);
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
		var sky = game.add.sprite(0,0, 'sky');
		sky.scale.x = 2;
		sky.scale.x = 1.5;
		console.log( sky );
		
		
		//	The platforms group contains the ground and the 2 ledges we can jump on
		platforms = game.add.group();
		platforms.enableBody = true;
		
		clouds = game.add.group();
		clouds.enableBody = false;
		var cloud1 = clouds.create(900, 120, 'clouds');
		
		var cloud_inMotion = game.add.tween(cloud1);
		cloud_inMotion.to({ x: -200 }, 30000, 'Linear', true, 0);
		
		
		
		// params are: properties to tween, time in ms, easing and auto-start tweenthis.game.add.tween(sprite).to({x: 100, y: 200}, 1000, Phaser.Easing.Quadratic.InOut, true);
		
		// Here we create the ground.
		var ground = platforms.create(0, game.world.height - 150, 'ground');
	
		//	Scale it to fit the width of the game (the original sprite is 400x32 in size)
		ground.scale.setTo(6, 5);
	
		//	This stops it from falling away when you jump on it
		ground.body.immovable = true;
	
		//	Now let's create two ledges
		var ledge = platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;
	
		ledge = platforms.create(-150, 250, 'ground');
		ledge.body.immovable = true;
	
		// The player and its settings
		player = game.add.sprite(48, game.world.height - 200, 'dude');
	
		//	We need to enable physics on the player
		game.physics.arcade.enable(player);
	
		//	Player physics properties. Give the little guy a slight bounce.
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 400;
		player.body.collideWorldBounds = true;
		
		
		
		//	Our two animations, walking left and right.
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
	
		//	Finally some hops to collect
		hops = game.add.group();
	
		//	We will enable physics for any star that is created in this group
		hops.enableBody = true;
	
		// create the hops
		for (var i = 0; i < 3; i++)
		{
			//	Create a star inside of the 'stars' group
			var hop = hops.create(i * 290, 0, 'hop');
	
			//	Let gravity do its thing
			hop.body.gravity.y = 900;
	
			//	This just gives each hop a slightly random bounce value
			hop.body.bounce.y = 0.1 + Math.random() * 0.2;
		}
	
		//	The score
		hopText = game.add.text(16, 16, 'Hops Collected: 0', { fontSize: '32px', fill: '#FFF' });
		
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
	
		//	Checks to see if the player overlaps with any of the hops, if he does call the collectHop function
		game.physics.arcade.overlap(player, hops, collectHop, null, this);
	
		//	Reset the players velocity (movement)
		player.body.velocity.x = 0;
		
		if (cursors.left.isDown || left )
		{
			//	Move to the left
			player.body.velocity.x = -150;
	
			player.animations.play('left');
		}
		else if (cursors.right.isDown || right )
		{
			//	Move to the right
			player.body.velocity.x = 150;
	
			player.animations.play('right');
		}
		else
		{
			//	Stand still
			player.animations.stop();
	
			player.frame = 4;
		}
		
		//	Allow the player to jump if they are touching the ground.
		if (cursors.up.isDown && player.body.touching.down)
		{
			player.body.velocity.y = -350;
		}
		
		if (jump){ jump_now(); }
		
		 if (game.input.currentPointers == 0 && !game.input.activePointer.isMouse){ jump=false; left=false; right=false; } //this works around a "bug" where a button gets stuck in pressed state
	
	}
	
	function collectHop (player, hop) {
		
		// Removes the hop from the screen
		hop.kill();
	
		//	Add and update the score
		hopTotal += 1;
		hopText.text = 'Hops Collected: ' + hopTotal;
		$scope.recipe.hops  = hopTotal;
	
	}
	
	function gofull() { game.scale.startFullScreen(false); }
	
	function jump_now(){	//jump with small delay
		
		
		if (game.time.now > nextJump ){
			player.body.velocity.y = -300;
			nextJump = game.time.now + 2000;
		}
	}
	
	function build_buttons() {
		var buttonPos = {
			jump: [900,600],
			left: [75,600],
			right: [150,600]
		};
		
		// jump
		buttonjump = game.add.button(buttonPos.jump[0], buttonPos.jump[1], 'buttonjump', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		buttonjump.fixedToCamera = true;	 //our buttons should stay on the same place  
		buttonjump.events.onInputOver.add(function(){jump=true;});
		buttonjump.events.onInputOut.add(function(){jump=false;});
		buttonjump.events.onInputDown.add(function(){jump=true;});
		buttonjump.events.onInputUp.add(function(){jump=false;});
		buttonjump.scale.x = 0.25;
		buttonjump.scale.y = 0.25;	
		
		
		//left
		buttonleft = game.add.button(buttonPos.left[0], buttonPos.left[1], 'buttonleft', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		buttonleft.fixedToCamera = true;	 //our buttons should stay on the same place  
		buttonleft.events.onInputOver.add(function(){left=true;});
		buttonleft.events.onInputOut.add(function(){left=false;});
		buttonleft.events.onInputDown.add(function(){left=true;});
		buttonleft.events.onInputUp.add(function(){left=false;});
		buttonleft.scale.x = 0.25;
		buttonleft.scale.y = 0.25;
		
		//right
		buttonright = game.add.button(buttonPos.right[0], buttonPos.right[1], 'buttonright', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
		buttonright.fixedToCamera = true;  //our buttons should stay on the same place  
		buttonright.events.onInputOver.add(function(){right=true;});
		buttonright.events.onInputOut.add(function(){right=false;});
		buttonright.events.onInputDown.add(function(){right=true;});
		buttonright.events.onInputUp.add(function(){right=false;});
		buttonright.scale.x = 0.25;
		buttonright.scale.y = 0.25;

	} 

	
}])