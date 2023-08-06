/*
p5.js script for Breakout game
David Norman Diaz Estrada
https://github.com/DavidDZ7/breakout
August 2023
 */

backgroundColor='#444444'
paddleColor='#999999';
ballColor="#CCCCCC";
targetColors=["#CC0000","#CCCC00","#00CC00","#0000CC"];

paddle1=null
ball1=null
score1=null
targets=[]//list to store target objects
const offset=3;//space between targets

function setup() {
  createCanvas(windowWidth, windowHeight);
  targets = createTargets()
  paddle1 = new paddle();
  ball1 = new ball();
}

function draw() {
  background(backgroundColor);
  showGameInstructions();
  for (const obj of targets) {
    obj.show(); 
  }
  paddle1.show();
  ball1.update(paddle1);
  ball1.check_if_ball_passed_bottom();
  //score=ball1.checkIfScored();
  ball1.show();

  checkKeys();
}

function createTargets(){
  let rows=4;
  let cols=10;
  let targetWidth=(windowWidth-offset*(cols+1))/cols;
  let targetHeight=((windowHeight-offset*rows)/4)/rows;
  targets=[]
  for (row=0;row<rows;row++){
    let targetColor=targetColors[row]
    for (col=0;col<cols;col++){
      targets.push(new target(row,col,targetWidth,targetHeight,targetColor))
    }
  }
  return targets
}

function showGameInstructions(){
  let instructions="Use RIGHT and LEFT keys"
  strokeWeight(0);
  textSize(25);
  let textWidth_ = textWidth(instructions);
  let textHeight_ = textAscent(instructions) + textDescent(instructions);
  //display a background rectangle for the instructions
  fill(150);
  rectMode('corner')
  rect(x=0,y=windowHeight-textHeight_-7,h=windowWidth,w=textHeight_)
  //display the instructions centered at the bottom
  fill(20);
  text(instructions,x=windowWidth/2-textWidth_/2,y=windowHeight-textHeight_/2);
}

function checkKeys() {
  if (keyIsDown(RIGHT_ARROW)) {
    paddle1.update(direction=1); // Move paddle to the right
  } else if (keyIsDown(LEFT_ARROW)) {
    paddle1.update(direction=-1); // Move paddle to the left
  }
}


function windowResized() {//restart game if window is resized
  resizeCanvas(windowWidth, windowHeight);
  paddle1=null
  ball1=null
  score1=null
  setup()
}


class paddle{
  constructor(){
    this.width=150;
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

  update(direction){
    this.x=this.x+direction*this.speed;
    //ensure the paddle does not go outside the window:
    this.x=max(min(this.x,windowWidth-this.width/2),this.width/2);
  }

}


class ball{
  constructor(){
    this.diameter=40;
    this.color=ballColor;
    this.speed=6//max(5,0.008*windowWidth);//speed should increase for larger window width
    this.direction=1;
    this.reset(this.direction);
  }

  reset(direction){
    this.x=windowWidth/2;
    this.y=windowHeight/4;
    let angle=Math.PI/2//random(-Math.PI/8,Math.PI/8)//between -22.5 and 22.5 degrees
    this.Xspeed=this.speed*cos(angle);
    this.Yspeed=this.speed*sin(angle)*direction;//direction is -1 or 1
  }

  show(){
    fill(this.color);
    strokeWeight(4); 
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
      let angle=(Math.PI/2)*normalizedCenterDiff //range [-45,45] degrees
      this.Yspeed=-1*this.speed*cos(angle)//move ball up (negative Yspeed)
      this.Xspeed=this.speed*sin(angle)
    }
    
  }

  check_if_ball_passed_bottom(){
    if (this.y+this.diameter/2>=windowHeight){
      let direction = 1
      this.reset(direction=1)
    }
  }

}


class target{
  constructor(row,col,w,h,color){
    this.width=w;
    this.height=h;
    this.y=row*this.height+this.height/2+offset*(row+1)
    this.x=col*this.width+this.width/2+offset*(col+1)
    this.radius=10;
    this.color=color;
  }

  show() {
    fill(this.color);
    strokeWeight(1);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height,this.radius);
  }

}


class scoreText{
  constructor(){
    this.score=0;
    this.y=this.windowHeight;
    this.x=0
  }
  show(){
    fill(20);
    strokeWeight(4); 
    textSize(30);
    var s='SCORE: '+str(this.score);
    text(s,this.x,this.y);
  }
}