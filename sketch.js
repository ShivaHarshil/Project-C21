var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var invisibleSky;
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var bg,bgImage;

function preload(){
  trex_running = loadAnimation("Plane1.png","Plane2.png","Plane3.png","Plane4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  bgImage = loadImage("city.jpg")
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("BOMB1.png");
  obstacle2 = loadImage("Missile.png");
  obstacle3 = loadImage("Meteor.png");

  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600,200);
  bg=createSprite(300,100,600,200)
  bg.addImage(bgImage)
  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,115,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.25;
  

  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  invisibleSky = createSprite(200,10,400,10)
  invisibleSky.visible = false;
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  
  background(180);

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    bg.visible = true
    obstacle1.visible = true;
    obstacle2.visible = true;
    obstacle3.visible = true;

    bg.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (bg.x < 100){
      bg.x = 300;
    }
  
    if(keyDown("up")){

      trex.velocityY=-5
    }

  if(keyDown("down")){

    trex.velocityY=5
  }
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
    background("black")
     //change the trex animation
      strokeWeight(15);
      stroke("yellow")
    fill("green");
     textSize(50);
     text("Game Over",170,70);
      
    strokeWeight(7);
    stroke("blue");
    fill("yellow");
     textSize(23);
    text("Press Space to Restart",200,130);
    bg.visible = false
    obstacle1.visible = false;
    obstacle2.visible = false;
    obstacle3.visible = false;
    trex.changeAnimation("Plane1",trex_running)
    trex.velocityY = 0;
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
     obstaclesGroup.setVelocityXEach(0);   

     if(keyDown("space")) {
      reset(); 

    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  trex.collide(invisibleSky);




  drawSprites();

    //displaying score
    text("Score: "+ score, 470,50);
    fill("yellow")
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  score=0;
  trex.changeAnimation("Plane1",trex_running)
 

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,115,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;

      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}


