/*
p5.js script for Breakout game
David Norman Diaz Estrada
https://github.com/DavidDZ7/breakout
August 2023
 */

backgroundColor='#444444'
paddleColor='#999999';
ballColor="#CCCCCC";
targetColors=["#f95929","#f9d300","#00cd00","#26c0ff"]//["#CC0000","#CCCC00","#00CC00","#0000CC"];

const rows=targetColors.length;
const cols=10;

paddle1=null
ball1=null
score1=null
targets=[]//list to store target objects
score=0

function setup() {
  createCanvas(windowWidth, windowHeight);
  [targets,targetWidth,maxWinPoints] = createTargets(rows,cols);
  //console.log("maxWinpoints: ",maxWinPoints);
  paddle1 = new paddle(targetWidth);//make paddle with same width as targets
  ball1 = new ball(targetWidth/4);//make ball's diameter equal to a fourth of a target's width
}

function draw() {
  let gameIsOver=ball1.check_if_ball_passed_bottom(paddle1);
  if (gameIsOver){
    ShowGameOver();//display text
    setTimeout(restartGame, 1500);//restart after 1.5 seconds
    noLoop();//stop the draw function
  }
  else if(score==maxWinPoints){
    showGameInfo();
    ShowWin();
    noLoop();//stop the draw function
  }
  else{
    background(backgroundColor);
    showGameInfo();
    //Check collisions with targets:
    for (let i =0; i <targets.length; i++) {
      const currentTarget = targets[i];
  
      let collision=currentTarget.detectCollision(ball1); 
      if (collision){
        //increase score:
        score+=1;
        //bounce ball:
        ball1.Yspeed=abs(ball1.Yspeed);
        //decrease target life:
        currentTarget.life-=1;
        if (currentTarget.life<1){//hide target
          currentTarget.visible=false;
          currentTarget.checkCollisions=false;}
        break;
      }
  
    }
  
    //Show visible targets:
    for (const currentTarget of targets) {
      if (currentTarget.visible){currentTarget.show();}
    }
    //Update ball:
    ball1.update(paddle1);
    ball1.show();
    //Update paddle:    
    paddle1.update();
    paddle1.show();
  }
}

function createTargets(rows,cols){
  let maxWinPoints=0
  let targetWidth=windowWidth/cols;
  let targetHeight=(windowHeight/4)/rows;
  targets=[]
  targetLife=targetColors.length;

  for (row=0;row<rows;row++){
    let checkCollisions=true;
    for (col=0;col<cols;col++){
      targets.push(new target(row,col,targetWidth,targetHeight,checkCollisions,targetLife))
      maxWinPoints=maxWinPoints+targetLife
    }
    targetLife-=1;
  }
  return [targets,targetWidth,maxWinPoints]
}

function ShowGameOver(){
  let gameOverText="GAME OVER!";
  strokeWeight(0);
  textSize(40);
  let textWidth_ = textWidth(gameOverText);
  let textHeight_ = textAscent(gameOverText) + textDescent(gameOverText);
  //display text at the center of window
  fill(20);
  text(gameOverText,x=windowWidth/2-textWidth_/2,y=windowHeight/2-textHeight_/2);
}

function ShowWin(){
  let winText="YOU WON!";
  strokeWeight(0);
  textSize(40);
  let textWidth_ = textWidth(winText);
  let textHeight_ = textAscent(winText) + textDescent(winText);
  //display text at the center of window
  fill(20);
  text(winText,x=windowWidth/2-textWidth_/2,y=windowHeight/2-textHeight_/2);
}

function showGameInfo(){
  //----------------------------------------------------------------
  // DISPLAY GAME INSTRUCTIONS
  //----------------------------------------------------------------
  let instructions="Use RIGHT and LEFT keys";
  strokeWeight(0);
  textSize(25);
  let textWidth_ = textWidth(instructions);
  let textHeight_ = textAscent(instructions) + textDescent(instructions);
  //display a background rectangle for the instructions
  fill(150);
  rectMode('corner');
  rect(x=0,y=windowHeight-textHeight_-7,h=windowWidth,w=textHeight_);
  //display the instructions centered at the bottom
  fill(20);
  text(instructions,x=windowWidth/2-textWidth_/2,y=windowHeight-textHeight_/2);
  
  //----------------------------------------------------------------
  // DISPLAY SCORE
  //----------------------------------------------------------------
  let scoreText="SCORE: "+str(score);
  text(scoreText,x=0,y=windowHeight-textHeight_/2);
  
}



function windowResized() {//restart game if window is resized
  resizeCanvas(windowWidth, windowHeight);
  restartGame()
}


function restartGame(){
  paddle1=null
  ball1=null
  score1=null
  targets=[]
  score=0
  setup()//initialize game configuration
  loop()//resume the draw function
}

class paddle{
  constructor(width){
    this.width=width;
    this.height=20;
    this.y=windowHeight-2.5*this.height;
    this.radius=10;
    this.speed=10;
    this.x=windowWidth/2;
    this.color=paddleColor;
  }

  show() {
    fill(this.color);
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height,this.radius);
  }

  update() {
    if (keyIsDown(RIGHT_ARROW)) {    
      this.move(1); // Move paddle to the right
    } else if (keyIsDown(LEFT_ARROW)) {
      this.move(-1); // Move paddle to the left
    }
  }

  move(direction){
    this.x=this.x+direction*this.speed;
    //ensure the paddle does not go outside the window:
    this.x=max(min(this.x,windowWidth-this.width/2),this.width/2);
  }

}


class ball{
  constructor(diameter){
    this.diameter=diameter;
    this.color=ballColor;
    this.speed=6;
    this.reset();
  }

  reset(){
    this.x=windowWidth/2;
    this.y=windowHeight/3;
    let angle=Math.PI/2;//90 degrees
    this.Xspeed=this.speed*cos(angle);
    this.Yspeed=this.speed*sin(angle);
  }

  show(){
    fill(this.color);
    strokeWeight(0); 
    circle(this.x, this.y, this.diameter);
  }

  update(paddle1){
    this.x=this.x+this.Xspeed;
    this.y=this.y+this.Yspeed;
    //ensure ball bounces when hitting left limit of window:
    if(this.x-this.diameter/2<=0){
      this.x=this.diameter/2;
      this.Xspeed=abs(this.Xspeed);}
    //ensure ball bounces when hitting right limit of window:
    else if(this.x+this.diameter/2>=windowWidth){
      this.x=windowWidth-this.diameter/2;
      this.Xspeed=-1*this.Xspeed;}
    //ensure ball bounces when hitting top limit of window:
    else if(this.y-this.diameter/2<=0){
      this.Yspeed=abs(this.Yspeed);}      
    //ensure ball bounces when hitting paddle:
    if(this.x>=paddle1.x-paddle1.width/2 && this.x<=paddle1.x+paddle1.width/2 && this.y+this.diameter/2>=windowHeight-3*paddle1.height){
      let normalizedCenterDiff=(paddle1.x-this.x)/paddle1.width//[-1,1] range
      let angle=(Math.PI/2)*normalizedCenterDiff //range [-90,90] degrees
      this.Yspeed=-1*this.speed*cos(angle)//move ball up (negative Yspeed)
      this.Xspeed=this.speed*sin(angle)
    }
    
  }

  check_if_ball_passed_bottom(paddle1){
    if (this.y+this.diameter/2>=windowHeight-2.5*paddle1.height){
      return true    
    }
    return false
  }

}


class target{
  constructor(row,col,w,h,checkCollisions,life){
    this.life=life;
    this.width=w;
    this.height=h;
    this.y=row*this.height+this.height/2;
    this.x=col*this.width+this.width/2;
    this.radius=10;
    this.checkCollisions=checkCollisions;
    this.visible=true;
  }

  show() {
    fill(targetColors[this.life-1]);
    strokeWeight(3);
    stroke(backgroundColor)
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height,this.radius);
  }

  detectCollision(ball){
    if (this.checkCollisions 
    && ball.x+ball.diameter/2>=this.x-this.width/2 //O-
    && ball.x-ball.diameter/2<=this.x+this.width/2 //-O
    && ball.y-ball.diameter/2 <= this.y+this.height/2){
      return true;
    }
    return false;
  }

}

