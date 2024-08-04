import { maze_creator } from "./mazegen.mjs";
import { print_walls } from "./mazegen.mjs";
import { print_map } from "./mapgen.mjs";
import { multiBiomes } from "./mapgen.mjs";

// ------------------------- INITIALIZE -----------------
var app;
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
  
    app.renderer.backgroundColor = 0x000000;
    // app.ticker.add(delta => gameLoop(delta));
    // let t1 = Date.now();
  
    // document.addEventListener('keydown', keyStart);
    // document.addEventListener('keyup', keyEnd);
}
function screenAdjust(){
    const screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const screenH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    app.renderer.resize(screenW, screenH);
  }

init()
const size=100;
let colnum = 0;
let xrectnum = Math.floor(app.renderer.width / size) + 1;
let yrectnum = Math.floor(app.renderer.height / size) + 1;
console.log(xrectnum)
let rect;
for (let i = 0; i < (xrectnum)*(yrectnum ); i++){
    let colorR = Math.floor(255 * (i % (xrectnum)) / (xrectnum));
    let colorG = Math.floor(255 * (colnum) / xrectnum);
    if (i % (xrectnum) == 0 && i > 0 ){ 
        rect = new PIXI.Graphics();
        rect.beginFill(colorR*256*256+colorG*256)
        rect.drawRect(size*xrectnum, size*colnum,(app.width-xrectnum*size),size)
        app.stage.addChild(rect)
        colnum++;
    }
    rect = new PIXI.Graphics();
    rect.beginFill(colorR*256*256+colorG*256);
    rect.drawRect(size*(i % xrectnum), size*colnum,size,size)
    app.stage.addChild(rect)
}
print_walls(maze_creator(30,30),30,30)
print_map(multiBiomes(20, 30, 30, 9, 50, 180), 30, 30)
// circle = new PIXI.Graphics();
// circle.beginFill(0x44FFFF);
// circle.drawCircle(100, 200, 25);
// circle.endFill();
// circle.x = 100-2*25;
// circle.y = 200-2*25;
// app.stage.addChild(circle);

// console.log(window.innerWidth)
// console.log(window.innerHeight)
// var texture = new PIXI.RenderTexture(renderer, 16, 16);
// var graphics = new PIXI.Graphics();
// graphics.drawCircle(8, 8, 8);
// graphics.beginFill(0x44FFFF);
// graphics.endFill();
// texture.render(graphics);