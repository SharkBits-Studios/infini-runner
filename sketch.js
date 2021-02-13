var trex,
  ground,
  invisibleGround,
  gameOver,
  restart,
  score,
  ObstaclesGroup,
  CloudsGroup;
var trexAnimation, cityAnimation, obstacleAnimation;

const player = trex;

//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  cityAnimation = loadImage("city.jpg");
  trexAnimation = loadImage("player.png");
  obstacleAnimation = loadImage("atom.png");
}

function setup() {
  //create a trex sprite
  trex = createSprite(200, 380, 20, 50);
  trex.addImage(trexAnimation);
  canvas = createCanvas(400, 400);

  trex.velocityX = 5;

  //set collision radius for the trex
  //trex.debug = true
  trex.setCollider("circle", 0, 0, 45);

  //scale and position the trex
  trex.scale = 0.3;
  trex.x = 50;

  //create a ground sprite
  ground = createSprite(200, 800, 16000000000000000, 20);

  //ground.setAnimation("ground2");
  ground.x = ground.width / 2;

  //invisible Ground to support Trex
  invisibleGround = createSprite(200, 800, 16000000000000000000000000000000, 5);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  ObstaclesGroup = createGroup();
  CloudsGroup = createGroup();

  //place gameOver and restart icon on the screen
  gameOver = createSprite(200, 300);
  restart = createSprite(trex.x, trex.y);
  //gameOver.setAnimation("gameOver");
  gameOver.scale = 0.5;
  //restart.setAnimation("restart");
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  //set text
  textSize(18);
  textFont("comic sans");
  textStyle(BOLD);

  //score
  score = 0;
}

function draw() {
  //set background to white
  background(cityAnimation);
  //display score
  text("Score: " + score, trex.x - 100, trex.y - 100);
  console.log(gameState);

  camera.x = trex.x;
  camera.y = trex.y;

  if (gameState === PLAY) {
    //move the ground
    ground.velocityX = -(6 + (3 * score) / 100);
    //scoring
    if (World.frameCount % 10 === 0) {
      score = score + 1;
    }

    if (score > 0 && score % 100 === 0) {
      playSound("checkPoint.mp3");
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= 359) {
      trex.velocityY = -15;
      //playSound("jump.mp3");
    }

    //add gravity
    trex.velocityY = trex.velocityY + 1;

    //spawn the clouds
    spawnClouds();

    //spawn obstacles
    spawnObstacles();

    //End the game when trex is touching the obstacle
    if (ObstaclesGroup.isTouching(trex)) {
      //playSound("jump.mp3");
      gameState = END;
      //playSound("die.mp3");
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    trex.velocityX = 0;

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);

    //change the trex animation
    //trex.setAnimation("trex_collided");

    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
  }

  if (mousePressedOver(restart) && restart.visible === true) {
    reset();
  }

  //console.log(trex.y);

  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  //trex.setAnimation("trex");
  trex.y = 380;
  score = 0;
}

function spawnObstacles() {
  if (World.frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x + 200, trex.y, 10, 40);

    obstacle.addImage(obstacleAnimation);

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.3;
    obstacle.lifetime = 70;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(trex.x + 300, 320, 40, 10);
    cloud.y = random(280, 320);
    //cloud.setAnimation("cloud");
    cloud.scale = 0.5;

    //assign lifetime to the variable
    cloud.lifetime = 134;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
}
