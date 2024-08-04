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

function map_init(cell_width, cell_height) {
    
    const cell_num = Math.floor((app.renderer.width * app.renderer.height)/(cell_width * cell_height));
    const cell_size = cell_width*cell_height;
    let xrectnum = Math.floor(app.renderer.width / cell_num) + 1;
    let yrectnum = Math.floor(app.renderer.height / cell_num) + 1;
    alert("broken?")
    // console.log(xrectnum)
    let rect;
    // print_walls(maze_creator(30,30),30,30);
    const map = multiBiomes(Math.floor(cell_num / 20), cell_width, cell_height, 9, Math.floor(cell_num / 20), Math.floor(cell_num * 3/ 20));
    for (let i = 0; i < cell_num; i++){
        // let colorR = Math.floor(255 * (i % (xrectnum)) / (xrectnum));
        // let colorG = Math.floor(255 * (colnum) / xrectnum);
        rect = new PIXI.Graphics();
        // if (i % xrectnum == 0)
        //     alert(map[i])
        switch(map[i]){
        case 0:
            //Set Color To Biome Plains
            rect.beginFill(0x08c208);
            break;
        case 1:
            //Set Color To Biome Forest
            rect.beginFill(0x0c870c);
            break;
        case 2:
            //Set Color To Biome Snowy
            rect.beginFill(0xFFFFFF);
            break;
        case 3:
            //Set Color To Biome Desert
            rect.beginFill(0xccc621);
            break;
        case 4:
            //Set Color To Biome Savvanah
            rect.beginFill(0xcca421);
            break;
        case 5:
            //Set Color To Biome Taiga/Coniferus Forest
            rect.beginFill(0x9cbf91);
            break;
        case 6:
            //Set Color To Biome RainForest
            rect.beginFill(0x32996e);
            break;
        default:
            console.log(map[i])
        }
        // rect.beginFill(colorR*256*256+colorG*256)
        // rect.beginFill(colorR*256*256+colorG*256);
        rect.drawRect(cell_size*(i % xrectnum), cell_size*(Math.floor(i / xrectnum)),cell_size,cell_size)
        app.stage.addChild(rect)
    }
}

init()
// map_init(10,10)
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