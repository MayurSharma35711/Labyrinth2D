// CLASSES and VARIABLES
var app;
var screenW;
var screenH;
var gravity = -10;
var t1;
var lose = false;
var pause = false;
var condition = !lose && !pause;


class planet{
  constructor(mass, rad, posX, posY, color){
    this.mass = mass;
    this.rad = rad;
    this.x = posX + this.rad/2;
    this.y = posY + this.rad/2;
    this.circle = new PIXI.Graphics();
    this.circle.beginFill(color);
    this.circle.drawCircle(this.x, this.y, this.rad);
    this.circle.endFill();
    this.circle.x = this.x-2*this.rad;
    this.circle.y = this.y-2*this.rad;
    app.stage.addChild(this.circle);
  }
}

class player{
  constructor(x,y){
    this.rectangle = new PIXI.Graphics();
    this.rectangle.beginFill(0x66CCFF);
    this.rectangle.lineStyle(4, 0xFF3300, 1);
    this.lw = 24;
    this.rectangle.drawRect(0,0, this.lw, this.lw);
    this.rectangle.endFill();
    this.rectangle.pivot.set(this.lw/2, this.lw/2)
    this.rectangle.rotation = 0;
    this.rectangle.x = x - this.lw/2;
    this.rectangle.y = y - this.lw/2;
    app.stage.addChild(this.rectangle);
    this.accelX = 0;
    this.accelY = 0;
    this.velX = 0;
    this.velY = 0;
    this.mass = 1;
    // from keyboard input and useful for testing
    this.inpAx = 0;
    this.inpAy = 0;
    this.inpOmega = 0; // rotational velocity
    this.forceInp = 4;
  }
  updatePosSpace(time, massive){
    // Get Basic Info Related to Object
    var dx = - (massive.x + massive.rad/2 - this.rectangle.x - this.lw/4); //+ test.rad
    var dy = - (massive.y + massive.rad/2 - this.rectangle.y - this.lw/4); //+ test.rad
    var dl = dx*dx + dy*dy;
    dl = Math.sqrt(dl);
    var cosine = dx/dl;
    var sine = dy/dl;
    var dt = Date.now()-time;

    this.updateAccel(dl,massive, cosine, sine);
    this.accelX += this.inpAx*dt/3000;
    this.accelY += this.inpAy*dt/3000;
    this.velX += this.accelX*dt/20;
    this.velY += this.accelY*dt/20;
    console.log(this.inpAx);
    this.rectangle.x += this.velX*dt/10;
    this.rectangle.y += this.velY*dt/10;

    var dx = - (massive.x + massive.rad/2 - this.rectangle.x); //+ test.rad
    var dy = - (massive.y + massive.rad/2 - this.rectangle.y); //+ test.rad

    var dl = dx*dx + dy*dy;
    dl = Math.sqrt(dl);
    var cosine = dx/dl;
    var sine = dy/dl;
    this.updateAccel(dl,massive,cosine,sine);
    this.velX += this.accelX*dt/20;
    this.velY += this.accelY*dt/20;
    // console.log("dx:\t"+Math.round(dx)+ ", \tdy:\t"+Math.round(dy) +", \tx:\t"+Math.round(this.rectangle.x)+", \ty:\t"+Math.round(this.rectangle.y));
    // console.log("x: \t" + this.accelX + "\t y: \t" + this.accelY);
  }
  updateRot(time){
    var dt = Date.now()-time;
    this.rectangle.rotation += this.inpOmega*dt/10;
    // console.log(this.rectangle.rotation)
  }
  updateAccel(dl, massive, cosine, sine){
    if(dl >= massive.rad){
      this.accelX = gravity*massive.mass/(dl*dl) * cosine;
      this.accelY = gravity*massive.mass/(dl*dl) * sine;
      // console.log((gravity*test.mass/(dl*dl))*(gravity*test.mass/(dl*dl)) - this.accelX*this.accelX - this.accelY*this.accelY)
    }
    else{
      if(dl < massive.rad/40){
          this.accelX = 0;
          this.accelY = 0;
      }
      else if (dl > 0) {
        var rad_prop = (dl / massive.rad) * (dl / massive.rad) * (dl / massive.rad);
        this.accelX = gravity*massive.mass/(dl*dl) * cosine * rad_prop;
        this.accelY = gravity*massive.mass/(dl*dl) * sine * rad_prop;
      }
    }
  }
}



// CODE TO DO STUFF

init();
var test1 = new planet(100,100,200,200, 0x99F66F);
// var test2 = new planet(50,50,350,150,0x99F66F)
var p1 = new player(200,200);
p1.velX = 0;
p1.velY = 0;
gameLoop();

// FUNCTIONS

function init(){
  let type = "WebGL";
  if(!PIXI.utils.isWebGLSupported()){
    type = "canvas";
  }

  PIXI.utils.sayHello(type);
  app = new PIXI.Application({width: 256, height: 256, autoResize: true});
  document.body.style.marginTop = 0;
	document.body.style.marginLeft = 0;
	document.body.style.marginBottom = 0;
	document.body.style.marginUp = 0;
  screenAdjust();
  // console.log(app.width);
  document.body.appendChild(app.view);

  // gameScene = new PIXI.Container();
  // app.stage.addChild(gameScene);
  // var texture = PIXI.Texture.fromImage('Imgs/Stars.jpg');
  // var background = new PIXI.Sprite(texture);
  // gameScene.addChild(background);

  app.renderer.backgroundColor = 0x061639;
  app.ticker.add(delta => gameLoop(delta));
  t1 = Date.now();

  document.addEventListener('keydown', keyStart);
  document.addEventListener('keyup', keyEnd);
}

function keyStart(e){
  var key = e.keyCode;
  if(key == 65){ // a
    p1.inpOmega = -0.03;
  }
  else if(key == 68){ // d
    p1.inpOmega = 0.03;
  }
  else if(key == 39){ // right
    p1.inpAx = p1.forceInp*Math.cos(p1.rectangle.rotation);
    p1.inpAy = p1.forceInp*Math.sin(p1.rectangle.rotation);
  }
  else if(key == 37){ // left
    p1.inpAx = -p1.forceInp*Math.cos(p1.rectangle.rotation);
    p1.inpAy = -p1.forceInp*Math.sin(p1.rectangle.rotation);
  }
  else if(key == 38){ // up
    p1.inpAy = -p1.forceInp*Math.cos(p1.rectangle.rotation);
    p1.inpAx = p1.forceInp*Math.sin(p1.rectangle.rotation);
  }
  else if(key == 40){ // down
    p1.inpAy = p1.forceInp*Math.cos(p1.rectangle.rotation);
    p1.inpAx = -p1.forceInp*Math.sin(p1.rectangle.rotation);
  }
}
function keyEnd(e){
  var key = e.keyCode;
  if(key == 65){
    if(p1.inpOmega == -0.03){
      p1.inpOmega = 0;
    }
  }
  else if(key == 68){
    if(p1.inpOmega == 0.03){
      p1.inpOmega = 0;
    }
  }
  // NEEDS TO BE ADJUSTED FOR ROTATION
  else if(key == 39){
      p1.accelX -= p1.inpAx;
      p1.inpAx = 0;
      p1.accelY -= p1.inpAy;
      p1.inpAy = 0;
  }
  else if(key == 37){
    p1.accelX -= p1.inpAx;
    p1.inpAx = 0;
    p1.accelY -= p1.inpAy;
    p1.inpAy = 0;
  }
  else if(key == 38){
    p1.accelY -= p1.inpAy;
    p1.inpAy = 0;
    p1.accelX -= p1.inpAx;
    p1.inpAx = 0;
  }
  else if(key == 40){
    p1.accelY -= p1.inpAy;
    p1.inpAy = 0;
    p1.accelX -= p1.inpAx;
    p1.inpAx = 0;
  }
}

function screenAdjust(){
  screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  screenH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  app.renderer.resize(screenW, screenH);
}

function gameLoop(delta){
  // console.log(t1);
  p1.updatePosSpace(t1, test1);
  p1.updateRot(t1);
  // p1.updatePosSpace(t1, test2)
  screenAdjust();
  t1 = Date.now();
}