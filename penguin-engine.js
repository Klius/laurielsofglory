/**
 * Initialize the Game and start it.
 */
var game = new Game();

function init() {
	if(game.init())
	game.start();
}

/**
 * QuadTree object.
 *
 * The quadrant indexes are numbered as below:
 *     |
 *  1  |  0
 * —-+—-
 *  2  |  3
 *     |
 */
function QuadTree(boundBox, lvl) {
	var maxObjects = 10;
	this.bounds = boundBox || {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	var objects = [];
	this.nodes = [];
	var level = lvl || 0;
	var maxLevels = 5;
	/*
	 * Clears the quadTree and all nodes of objects
	 */
	this.clear = function() {
		objects = [];
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].clear();
		}
		this.nodes = [];
	};
	/*
	 * Get all objects in the quadTree
	 */
	this.getAllObjects = function(returnedObjects) {
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].getAllObjects(returnedObjects);
		}
		for (var i = 0, len = objects.length; i < len; i++) {
			returnedObjects.push(objects[i]);
		}
		return returnedObjects;
	};
	/*
	 * Return all objects that the object could collide with
	 */
	this.findObjects = function(returnedObjects, obj) {
		if (typeof obj === "undefined") {
			console.log("UNDEFINED OBJECT");
			return;
		}
		var index = this.getIndex(obj);
		if (index != -1 && this.nodes.length) {
			this.nodes[index].findObjects(returnedObjects, obj);
		}
		for (var i = 0, len = objects.length; i < len; i++) {
			returnedObjects.push(objects[i]);
		}
		return returnedObjects;
	};
	/*
	 * Insert the object into the quadTree. If the tree
	 * excedes the capacity, it will split and add all
	 * objects to their corresponding nodes.
	 */
	this.insert = function(obj) {
		if (typeof obj === "undefined") {
			return;
		}
		if (obj instanceof Array) {
			for (var i = 0, len = obj.length; i < len; i++) {
				this.insert(obj[i]);
			}
			return;
		}
		if (this.nodes.length) {
			var index = this.getIndex(obj);
			// Only add the object to a subnode if it can fit completely
			// within one
			if (index != -1) {
				this.nodes[index].insert(obj);
				return;
			}
		}
		objects.push(obj);
		// Prevent infinite splitting
		if (objects.length > maxObjects && level < maxLevels) {
			if (this.nodes[0] == null) {
				this.split();
			}
			var i = 0;
			while (i < objects.length) {
				var index = this.getIndex(objects[i]);
				if (index != -1) {
					this.nodes[index].insert((objects.splice(i,1))[0]);
				}
				else {
					i++;
				}
			}
		}
	};
	/*
	 * Determine which node the object belongs to. -1 means
	 * object cannot completely fit within a node and is part
	 * of the current node
	 */
	this.getIndex = function(obj) {
		var index = -1;
		var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
		var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;
		// Object can fit completely within the top quadrant
		var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
		// Object can fit completely within the bottom quandrant
		var bottomQuadrant = (obj.y > horizontalMidpoint);
		// Object can fit completely within the left quadrants
		if (obj.x < verticalMidpoint &&
				obj.x + obj.width < verticalMidpoint) {
			if (topQuadrant) {
				index = 1;
			}
			else if (bottomQuadrant) {
				index = 2;
			}
		}
		// Object can fix completely within the right quandrants
		else if (obj.x > verticalMidpoint) {
			if (topQuadrant) {
				index = 0;
			}
			else if (bottomQuadrant) {
				index = 3;
			}
		}
		return index;
	};
	/*
	 * Splits the node into 4 subnodes
	 */
	this.split = function() {
		// Bitwise or [html5rocks]
		var subWidth = (this.bounds.width / 2) | 0;
		var subHeight = (this.bounds.height / 2) | 0;

		this.nodes[0] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[1] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[2] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[3] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
	};
}

/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a 
 * singleton.
 */
 
 var imageRepository = new function() {
	// Define images
	this.background = new Image();
	this.catapulta = new Image();
	this.rice = new Image();
	this.oriel = new Image();
	this.note = new Image();
	this.laura = new Image();
	this.laser = new Image();
    	
	// Ensure all images have loaded before starting the game
	var numImages = 7;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	}
	this.catapulta.onload = function() {
		imageLoaded();
	}
	this.rice.onload = function() {
		imageLoaded();
	}
	this.oriel.onload = function(){
		imageLoaded();
	}
	this.laura.onload = function(){
		imageLoaded();
	}
	this.note.onload = function(){
		imageLoaded();
	}
	this.laser.onload = function(){
		imageLoaded();
	}
	
	// Set images src
	this.oriel.src = "assets/sprites/oriel.png";
	this.background.src = "assets/sprites/background.png";
	this.catapulta.src = "assets/sprites/catapulta.png";
	this.rice.src = "assets/sprites/rice.png";
	this.laura.src = "assets/sprites/laura.png";
	this.note.src = "assets/sprites/note.png";
	this.laser.src = "assets/sprites/laser.png";
}

/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions. 
 */
function Drawable() {
	this.init = function(x, y, width, height,angle=0) {
		// Defualt variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.angle = angle;
	}
	
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	this.collidableWith = "";
	this.isColliding = false;
	this.type = "";
	
	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
	this.move = function() {
	};
	this.isCollidableWith = function(object) {
		return (this.collidableWith === object.type);
	};
}

/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
function Background() {
	this.speed = 1; // Redefine speed of the background for panning
	// Implement abstract function
	this.draw = function() {
		// Pan background
		this.y += this.speed;
		this.context.drawImage(imageRepository.background, this.x, this.y);
		
		// Draw another image at the top edge of the first image
		this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

		// If the image scrolled off the screen, reset
		if (this.y >= this.canvasHeight)
		{
			this.y = 0;
		}
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();
/**
 * The UI Overlay instructions for the forns
 */
 function Overlay(){
	this.letter = "A";
	this.hide =	false;
	this.drawed = false;
	this.draw = function(){
		if (!this.hide && !this.drawed){
			//this.context.globalAlpha = 0.7;
			this.context.beginPath();
			this.context.strokeStyle = "rgba(0,0,0,1)";
			this.context.fillStyle = "rgba(255,255,255,0.9)";
			this.context.rect(this.x-5, this.y-this.height+5, this.width, this.height);
			this.context.stroke();
			this.context.fill();
			this.context.closePath();
			this.context.fillStyle = "black";
			this.context.font = "30px Arial";
			this.context.fillText(this.letter,this.x,this.y);
			this.drawed = true;
		}
		else if(this.hide && this.drawed){
			this.context.clearRect(this.x-6, this.y-this.height+4, this.width+10, this.height+10);
			this.drawed = false;
		}
	};
 }
Overlay.prototype = new Drawable();
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
/**
* Orieeeeee
*
*/
function Oriel(){
	this.type = "enemy";
	this.collidableWith = "rice";
	this.speed = 1;
	this.score = 100;
	var counter = 0;
	var fireRate = 15;
	var firecounter =fireRate;
	this.alive = true;
	var hspeed = this.speed;
	var vspeed = this.speed;
	var hchange = getRandomInt(0,100);
	var vchange = getRandomInt(0,100);
	this.bulletPool = new Pool(2);
	this.bulletPool.init("note");
	this.draw = function(){
		
		this.context.drawImage(imageRepository.oriel, this.x, this.y);
	}
	this.move = function(){
		//this.context.clearRect(this.x-5, this.y, this.width+10, this.height);
		if (!this.isColliding){
			this.x += hspeed;
			this.y += vspeed;
			if (counter>=hchange){
				hspeed *=-1;
				counter = 0;
				hchange = getRandomInt(0,100);
			}
			if(this.x < 0){
				this.x = 0;
				hspeed *=-1;
			}
			else if (this.x+this.width>=this.canvasWidth)
			{
				this.x = this.canvasWidth -this.width;
				hspeed *=-1;
			}
			if (this.y>= this.canvasHeight){
				this.y = -this.height;
			}
			if (this.x >= game.catapulta.x && this.x <= game.catapulta.x+game.catapulta.swidth)
			{
				this.fire();
			}
			counter++;
			firecounter++;
		}
		else{
			this.alive = false
			addScore(this.score);
		}
	}
	this.fire = function() {
		if (firecounter>fireRate){
			var ricex = this.x+this.width/2-imageRepository.rice.width/2;
			var ricey = this.y+this.height-imageRepository.rice.height;
			this.bulletPool.get(this.x,this.y);
			firecounter = 0;
		}
	};
}
Oriel.prototype = new Drawable();
/***************************************************************+
*LAURAAAAAAAAAAAAAAAAAAAAAAAAAAAA
*
****************************************************************/
function Laura(){
	this.type = "enemy";
	this.collidableWith = "rice";
	this.isColliding = false;
	this.speed = 1;
	this.score = 50;
	var counter = 0;
	var fireRate = 15;
	var firecounter =fireRate;
	var hspeed = this.speed;
	var vspeed = this.speed;
	var hchange = getRandomInt(0,100);
	var vchange = getRandomInt(0,100);
	this.alive = true;
	this.bulletPool = new Pool(2);
	this.bulletPool.init("laser");
	this.draw = function(){
		
		this.context.drawImage(imageRepository.laura, this.x, this.y);
	}
	this.move = function(){
		//this.context.clearRect(this.x-5, this.y, this.width+10, this.height);
		if (!this.isColliding){
			this.x += hspeed;
			if(this.x < 0){
				this.x = 0;
				hspeed *=-1;
			}
			else if (this.x+this.width>=this.canvasWidth)
			{
				this.x = this.canvasWidth -this.width;
				hspeed *=-1;
			}
			if (this.x >= game.catapulta.x && this.x <= game.catapulta.x+game.catapulta.swidth)
			{
				this.fire();
			}
			counter++;
			firecounter++;
		}
		else{
			this.alive = false
			addScore(this.score);
		}
	}
	this.fire = function() {
		if (firecounter>fireRate){
			var ricex = this.x+12;//+20
			var ricey = this.y+19;
			this.bulletPool.getTwo(this.x+5,this.y+19,this.x+15,this.y+19,2);
			firecounter = 0;
		}
	};
}
Laura.prototype = new Drawable();
/****************************************************************
* ENEMY POOL
*
**************************************************************/
function Enemies(){
	this.enemyPool = [];
	this.limit = 10;
	this.init = function(){
		for(i =0;i<this.limit;i++){
			var enemy = new Laura();
			enemy.init(getRandomInt(50,600),getRandomInt(50,200),imageRepository.laura.width,imageRepository.laura.height);
			if (getRandomInt(0,10)>5){
				var enemy = new Oriel();
				enemy.init(getRandomInt(50,600),0,imageRepository.oriel.width,imageRepository.oriel.height);
			}
			this.enemyPool.push(enemy);
		}
	}
	this.update = function(){
		document.getElementById('lauriels').getContext('2d').clearRect(0, 0, 640, 480);
		for (i=0;i <this.limit;i++){
			if (this.enemyPool[i].alive){
				this.enemyPool[i].move();
				this.enemyPool[i].bulletPool.animate();
				this.enemyPool[i].draw();
				//console.log(this.enemyPool[i]);
			}
			else{
				this.enemyPool.splice(i, 1);
				this.spawnEnemy();
			}
		} 		
	}
	this.spawnEnemy = function(){
		var enemy = new Laura();
			enemy.init(getRandomInt(50,600),getRandomInt(50,200),imageRepository.laura.width,imageRepository.laura.height);
			if (getRandomInt(0,10)>5){
				var enemy = new Oriel();
				enemy.init(getRandomInt(50,600),0,imageRepository.oriel.width,imageRepository.oriel.height);
			}
			this.enemyPool.push(enemy);
	}
}
/**
 * Custom Pool object. Holds Bullet objects to be managed to prevent
 * garbage collection.
 */
function Pool(maxSize) {
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];
	
	this.getPool = function() {
		var obj = [];
		for (var i = 0; i < size; i++) {
			if (pool[i].alive) {
				obj.push(pool[i]);
			}
		}
		return obj;
	}
	/*
	 * Populates the pool array with Bullet objects
	 */
	this.init = function(bulletType) {
		for (var i = 0; i < size; i++) {
			// Initalize the bullet object
			if (bulletType == "rice"){
				var bullet = new Rice();
			}
			else if(bulletType=="note"){
				var bullet = new Note();
			}
			else if(bulletType=="laser"){
				var bullet = new Laser();
			}
			pool[i] = bullet;
		}
	};
	/*
	 * Grabs the last item in the list and initializes it and
	 * pushes it to the front of the array.
	 */
	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	};
	/*
	 * Used for the ship to be able to get two bullets at once. If
	 * only the get() function is used twice, the ship is able to
	 * fire and only have 1 bullet spawn instead of 2.
	 */
	this.getTwo = function(x1, y1, x2, y2, speed) {
		if(!pool[size - 1].alive &&
		   !pool[size - 2].alive) {
				this.get(x1, y1, speed);
				this.get(x2, y2, speed);
			 }
	};

	/*
	 * Draws any in use Bullets. If a bullet goes off the screen,
	 * clears it and pushes it to the front of the array.
	 */
	this.animate = function() {
		for (var i = 0; i < size; i++) {
			// Only draw until we find a bullet that is not alive
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}

function Rice(){
	this.speed = 2;
	this.alive = false;
	this.type = "rice";
	this.collidableWith = "enemy";
	this.height = 16;
	this.width = 16;
	this.x = 0;
	this.y = 0;
	this.draw = function(){
		this.context.clearRect(this.x, this.y, this.width, this.height)
		this.y -= this.speed;
		if (this.isColliding) {
			return true;
		}
		//out of bounds is dead
		if (this.y <= 0-this.height){
			return true;
		}else{
			this.context.drawImage(imageRepository.rice,this.x,this.y)
		}
		
	};
	/*
	 * Resets the bullet values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.alive = false;
		this.isColliding = false;
	};
	this.spawn = function(x,y){
		this.x=x;
		this.y=y;
		this.alive=true;
	};
	this.clear
}
Rice.prototype = new Drawable();
function Note(){
	this.speed = 2;
	this.alive = false;
	this.type = "enemybullet";
	this.collidableWith = "catapulta";
	this.height = 16;
	this.width = 16;
	this.x = 0;
	this.y = 0;
	this.draw = function(){
		this.context.clearRect(this.x, this.y, this.width, this.height)
		this.y += this.speed;
		if (this.isColliding) {
			return true;
		}
		//out of bounds is dead
		if (this.y > this.canvasHeight){
			return true;
		}else{
			this.context.drawImage(imageRepository.note,this.x,this.y)
		}
		
	};
	/*
	 * Resets the bullet values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.alive = false;
		this.isColliding = false;
	};
	this.spawn = function(x,y){
		this.x=x;
		this.y=y;
		this.alive=true;
	};
	this.clear
}
Note.prototype = new Drawable();
function Laser(){
	this.speed = 2;
	this.alive = false;
	this.type = "enemybullet";
	this.collidableWith = "catapulta";
	this.height = 16;
	this.width = 16;
	this.x = 0;
	this.y = 0;
	this.draw = function(){
		this.context.clearRect(this.x, this.y, this.width, this.height)
		this.y += this.speed;
		if (this.isColliding) {
			return true;
		}
		//out of bounds is dead
		if (this.y > this.canvasHeight){
			return true;
		}else{
			this.context.drawImage(imageRepository.laser,this.x,this.y)
		}
		
	};
	/*
	 * Resets the bullet values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.alive = false;
		this.isColliding = false;
	};
	this.spawn = function(x,y){
		this.x=x;
		this.y=y;
		this.alive=true;
	};
	this.clear
}
Laser.prototype = new Drawable();
/**
 * Create the catapulta object that the player controls. The catapulta is
 * drawn on the "catapult" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Catapulta() {
	this.speed = 3;
	this.bulletPool = new Pool(5);
	this.bulletPool.init("rice");
	this.collidableWith = "enemy";
	this.type = "catapulta";
	this.isDead = false;
	this.maxlife = 10;
	this.life = this.maxlife;
	this.sx = 0;
	this.swidth = 64;
	this.lifes = 3;
	var fireRate = 30;
	var counter = fireRate;
	var invFrames = 15;
	var invcounter = 0;
	this.draw = function() {
		//context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
		if (counter >=fireRate) {
			this.context.drawImage(imageRepository.catapulta,this.sx,0,this.swidth,this.height, this.x, this.y,this.swidth,this.height);
			var ricex= this.x+this.swidth/2-imageRepository.rice.width/2;
			this.context.drawImage(imageRepository.rice,ricex,this.y+this.height-imageRepository.rice.height);
		}
		else if( counter <= 10){
			this.context.drawImage(imageRepository.catapulta,this.sx+64,0,this.swidth,this.height, this.x, this.y,this.swidth,this.height);	
		}
		else{
			this.context.drawImage(imageRepository.catapulta,this.sx,0,this.swidth,this.height, this.x, this.y,this.swidth,this.height);
		}
	};
	this.move = function() {	
		counter++;
		this.context.clearRect(this.x, this.y, this.width+30, this.height+30);
		if (!this.isColliding) {
			//clear the catapulta
			
			// Keep player within the screen			
			if (this.y >= this.canvasHeight - this.height){
					this.y = this.canvasHeight - this.height;
					
			}
			if(this.y <= 0){
					this.y = 0;
			}
			if (this.x >= this.canvasWidth - this.width/2){
					this.x = this.canvasWidth - this.width/2;
					
			}
			if (this.x <= 0){ 
					this.x = 0;
					
			}
			invcounter++;
			// Finish by redrawing the Catapulta
		}
		else{
			if (!this.isDead && invcounter >= invFrames)
			{
				this.life -= 1;
				invcounter = 0;
			}
			if (this.life <= 0){
				this.isDead = true;
				//this.sx += this.swidth;
			}
			else{
				this.isColliding =false;
			}
		}
		this.draw();
		
	};
	
	/* 
	 * Fires two bullets
	 */
	this.fire = function() {
		if (counter >=fireRate){
			var ricex = this.x+this.swidth/2-imageRepository.rice.width/2;
			var ricey = this.y+this.height-imageRepository.rice.height;
			this.bulletPool.get(ricex,ricey)
			counter = 0;
		}
	};
}
Catapulta.prototype = new Drawable();
/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
	this.messages = function(){
		//GameOverMessage
		var gameover = new Overlay();
		gameover.init(this.overlayCanvas.width/2 -120/2,this.overlayCanvas.height/2-30,120,30,0);
		gameover.letter = "Roasted";
		if(this.catapulta.isDead && this.clicked){
			gameover.hide = false;
			gameover.draw();
			
		}
		else{
			gameover.hide = true;
			gameover.draw();
		}
		
		//console.log("Clicked:"+this.clicked+"Hide?:"+this.startMessage.hide+" drawed?:"+this.startMessage.drawed+"message:"+this.startMessage.letter);

	};
	this.readInput = function(){
		if (this.catapulta.isDead){
			if (KEY_STATUS.space){
				this.reset();
			}
		}
		else{
			if(KEY_STATUS.left){
				this.catapulta.x -=this.catapulta.speed;
			}
			else if(KEY_STATUS.right){
				this.catapulta.x += this.catapulta.speed;
			}
			if(KEY_STATUS.up){
				this.catapulta.y -= this.catapulta.speed;
			}
			else if(KEY_STATUS.down){
				this.catapulta.y += this.catapulta.speed;
			}
			if (KEY_STATUS.space){
				this.catapulta.fire();
			}
		}
	};
	this.reset = function () {
		this.catapulta.isDead = false;
		this.catapulta.sx = 0;
		this.catapulta.isColliding = false;		
	};
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on browsers that do not support the canvas.
	 */
	this.init = function() {
		this.score = 0;
		// Get the canvas elements
		this.bgCanvas = document.getElementById('background');
		this.playerCanvas = document.getElementById('catapulta');
		this.bulletCanvas = document.getElementById('bullets');
		this.enemyCanvas = document.getElementById('lauriels');
		this.overlayCanvas = document.getElementById('overlay');

		// Test to see if canvas is supported. Only need to
		// check one canvas
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.playerContext = this.playerCanvas.getContext('2d');
			this.bulletContext = this.bulletCanvas.getContext('2d');
			this.enemyContext = this.enemyCanvas.getContext('2d');
			this.overlayContext = this.overlayCanvas.getContext('2d');
			// Initialize objects to contain their context and canvas
			// information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			
			Catapulta.prototype.context = this.playerContext;
			Catapulta.prototype.canvasWidth = this.playerCanvas.width;
			Catapulta.prototype.canvasHeight = this.playerCanvas.height;
			
			Rice.prototype.context = this.bulletContext;
			Rice.prototype.canvasWidth = this.bulletCanvas.width;
			Rice.prototype.canvasHeight = this.bulletCanvas.height;
			Note.prototype.context = this.bulletContext;
			Note.prototype.canvasWidth = this.bulletCanvas.width;
			Note.prototype.canvasHeight = this.bulletCanvas.height;
			Laser.prototype.context = this.bulletContext;
			Laser.prototype.canvasWidth = this.bulletCanvas.width;
			Laser.prototype.canvasHeight = this.bulletCanvas.height;
			
			Overlay.prototype.context = this.overlayContext;
			Overlay.prototype.canvasWidth = this.overlayCanvas.width;
			Overlay.prototype.canvasHeight = this.overlayCanvas.height;
			
			Oriel.prototype.context = this.enemyContext;
			Oriel.prototype.canvasWidth = this.enemyCanvas.width;
			Oriel.prototype.canvasHeight = this.enemyCanvas.height;
			Laura.prototype.context = this.enemyContext;
			Laura.prototype.canvasWidth = this.enemyCanvas.width;
			Laura.prototype.canvasHeight = this.enemyCanvas.height;
			// Initialize the background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0
			// Initialize the Catapulta object
			this.catapulta = new Catapulta();
			// Set the catapulta to start in the middle of the canvas
			var shipStartX = this.playerCanvas.width/2 - imageRepository.catapulta.width/2;
			var shipStartY = this.playerCanvas.height-imageRepository.catapulta.height;
			this.catapulta.init(shipStartX, shipStartY, 64,
			               imageRepository.catapulta.height);
			/********************************ENEMY TEST**************************************************/
			this.enemies = new Enemies();
			this.enemies.init();
			//AUDIO
			this.backgroundAudio = new Audio("audio/loop-2.ogg");
			this.backgroundAudio.loop = true;
			this.backgroundAudio.volume = .25;
			this.backgroundAudio.load();
			
			//check if audio is loaded
			this.checkAudio = window.setInterval(function(){checkReadyState()},1000);
			
			//Start the quadtree
			this.quadTree = new QuadTree({x:0,y:0,width:this.bulletCanvas.width,height:this.bulletCanvas.height});
			
			
			return true;
		} else {
			return false;
		}
	};	
	
	// Start the animation loop
	this.start = function() {
		this.catapulta.draw();
		this.backgroundAudio.play();
		this.messages();
		animate();
	};
	/*
	*Function that shows everything related to gameover
	*/
	this.gamaOvar = function (){
		
	};
}

/**
 * Ensure the game sound has loaded before starting the game
 */
function checkReadyState() {
	if ( game.backgroundAudio.readyState === 4) {
		window.clearInterval(game.checkAudio);
		game.start();
	}
}

function updateUI(){
	document.getElementById("score").innerHTML=game.score;
	var lifepercent = game.catapulta.life/game.catapulta.maxlife;
	document.getElementById("life").style.backgroundSize = lifepercent*100 +"%";
	var bullets = 5-game.catapulta.bulletPool.getPool().length;
	var img = '<img src="assets/sprites/guirice.png"/>';
	var str = ""
	for (i =0;i<bullets;i++){
		str += img;
	}
	document.getElementById("rice").innerHTML=str;
	//console.log(bullets);
}
function addScore(score){
	game.score += score;
}

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a global function and cannot be within an
 * object.
 */
function animate() {
	// Insert objects into quadtree
	game.quadTree.clear();
	game.quadTree.insert(game.catapulta);
	game.quadTree.insert(game.catapulta.bulletPool.getPool());
	//bullets go here
	for(i=0;i<game.enemies.enemyPool.length;i++){
		game.quadTree.insert(game.enemies.enemyPool[i].bulletPool.getPool());
	}
	game.quadTree.insert(game.enemies.enemyPool)
	detectCollision();
	requestAnimFrame( animate );
	//Clear bullets
	game.bulletContext.clearRect(0, 0, game.enemyCanvas.width, game.enemyCanvas.height);
	// Animate game objects
	game.messages();
	game.background.draw();
	//ORIELS
	game.enemies.update();
	//PLAYER
	game.catapulta.move();
	game.catapulta.bulletPool.animate();
	game.readInput();
	updateUI();
	//game.forn.bulletPool.animate();
}

function detectCollision() {
	var objects = [];
	game.quadTree.getAllObjects(objects);

	for (var x = 0, len = objects.length; x < len; x++) {
		game.quadTree.findObjects(obj = [], objects[x]);

		for (y = 0, length = obj.length; y < length; y++) {

			// DETECT COLLISION ALGORITHM
			if (objects[x].collidableWith === obj[y].type &&
				(objects[x].x < obj[y].x + obj[y].width &&
			     objects[x].x + objects[x].width > obj[y].x &&
				 objects[x].y < obj[y].y + obj[y].height &&
				 objects[x].y + objects[x].height > obj[y].y)) {
				objects[x].isColliding = true;
				obj[y].isColliding = true;
			}
		}
	}
};


// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  74: 'bottomLeft',
  75: 'bottomMiddle',
  76: 'bottomRight',
  65: 'topLeft',
  83: 'topMiddle',
  68: 'topRight',
  84: 'toogleTop',
  66: 'toogleBottom'
  
};

// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}
/**
*
*Reads mouse coordinates and returns them
*
**/
function getMousePos(evt) {
		var canvas = document.getElementById("catapulta");
        var rect = canvas.getBoundingClientRect();
        mousePos = {
			x: mousePos.x+Math.round(evt.movementX),
y: mousePos.y+Math.round(evt.movementY)
        };
		//console.log(mousePos);
}
/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();