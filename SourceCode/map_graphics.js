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
    // const cell_size = cell_width*cell_height;
    let xrectnum = Math.floor(app.renderer.width / cell_width) + 1;
    let yrectnum = Math.floor(app.renderer.height / cell_height) + 1;
    // alert("broken?")
    // console.log(xrectnum)
    let rect;
    // print_walls(maze_creator(30,30),30,30);
    const map = multiBiomes(Math.min(Math.floor(cell_num / 30), 30), xrectnum, yrectnum, 9, Math.floor(cell_num / 20), Math.floor(cell_num * 3/ 20));
    // print_map(map, xrectnum, yrectnum)
    for (let i = 0; i < cell_num + xrectnum + 1; i++){
        // let colorR = Math.floor(255 * (i % (xrectnum)) / (xrectnum));
        // let colorG = Math.floor(255 * (colnum) / xrectnum);
        rect = new PIXI.Graphics();
        // if (i % xrectnum == 0)
        //     alert(map[i])




        // rather than define all the rectangles each time and assign color and attach each time
        // maybe we make an array of the colors, and then adding walls would be easier too
        switch(map[i]){
        case 0:
            //Set Color To Biome Plains
            rect.beginFill(0x08b208);
            break;
        case 1:
            //Set Color To Biome Snowy
            rect.beginFill(0xFFFFFF);
            break;
        case 2:
            //Set Color To Biome Desert
            rect.beginFill(0xccc621);
            break;
        case 3:
            //Set Color To Biome ShadowLands
            rect.beginFill(0x000065);
            break;
        case 4:
            //Set Color To Biome Poison Field
            rect.beginFill(0xAc0fB1);
            break;
        case 5:
            //Set Color To Biome Muddy RainForest
            rect.beginFill(0x85552e);
            break;
        case 6:
            //Set Color To Biome river / water biome
            rect.beginFill(0x3299FF);
            break;
        case 7:
            //Set Color To Biome Volcano
            rect.beginFill(0xDA306e);
            break;
        case 8:
            //Set Color To Rocky / Mountain
            rect.beginFill(0x666699);
            break;
        // case 9:
        //     //Set Color To Biome Forest
        //     rect.beginFill(0x0c870c);
        //     break;
        default:
            console.log(map[i])
        }
        // rect.beginFill(colorR*256*256+colorG*256)
        // rect.beginFill(colorR*256*256+colorG*256);
        rect.drawRect((cell_width)*(i % xrectnum), (cell_height)*(Math.floor(i / xrectnum)),cell_width,cell_height);
        app.stage.addChild(rect);
    }
}
// function maze_init(cell_width, cell_height) //Length is for lines(small rects)
// {
//     alert("Before width");
//     let width = Math.floor(app.renderer.width / cell_width);
//     alert("After width");
//     let height = Math.floor(app.renderer.height / cell_height);
//     // alert("height = ", height, "length = ", width);
//     alert(height);
//     alert(width);
//     let length = height;
//     alert(wall[0]);
//     alert(wall[1]);
//     alert(wall[2]);
//     alert(wall[3]);
//     alert(wall[4]);
//     let wall = maze_creator(width, height);
//     // alert("After Wall");
//     let line;
//     let xrectnum = (app.renderer.width/width) + 1;
//     alert(wall[0]);
//     alert(wall[1]);
//     alert(wall[2]);
//     alert(wall[3]);
//     alert(wall[4]);
//     for(let i = 0;i < width * height;i++)
//     {
//         line = new PIXI.Graphics();
//         line.beginFill(0xFFFFFF);
//         if(i % 2 == 0)
//         {
//             //This means the wall is a '|'
//             if(wall[i] == true)
//             {
//                 line.drawRect((i * length) % xrectnum, length * Math.floor(i / xrectnum), 4, length);
//                 app.stage.addChild(line);
//             }
//             continue;
//         }
//         //This means the wall is a '_'
//         if(wall[i] == true)
//         {
//             line.drawRect((i * length) % xrectnum, length * Math.floor(i / xrectnum), length, 4);
//             app.stage.addChild(line);
//         }
//     }
// }
function maze_init2(cell_width, cell_height) {
    let strval=""
    const cell_num = Math.floor((app.renderer.width * app.renderer.height)/(cell_width * cell_height));
    // const cell_size = cell_width*cell_height;
    let xrectnum = Math.floor(app.renderer.width / cell_width) + 1;
    let yrectnum = Math.floor(app.renderer.height / cell_height) + 1;
    // alert("broken?")
    // console.log(xrectnum)
    let rect;
    // print_walls(maze_creator(30,30),30,30);
    const walls = maze_creator(xrectnum, yrectnum);
    print_walls(walls,xrectnum,yrectnum)
    // print_map(map, xrectnum, yrectnum)
    for (let k = 0; k < yrectnum; k++) {
        for (let l = 0; l < 2*xrectnum; l++) {
            if (walls[l+k*2*xrectnum] == true) {
                rect = new PIXI.Graphics();
                rect.beginFill(0);
                console.log(l,k)
                if (l % 2 == 0) {
                    rect.drawRect((cell_width)*Math.floor(l/2), (cell_height)*k + Math.floor(cell_height * 0.9),cell_width,Math.floor(cell_height * 0.2));
                }
                else {
                    rect.drawRect((cell_width)*Math.floor(l/2) + Math.floor(cell_width * 0.9), (cell_height)*k,Math.floor(cell_width * 0.2),cell_height);
                }
                app.stage.addChild(rect);
            }
        }
    }
    let upbnd = new PIXI.Graphics();
    upbnd.beginFill(0x000000)
    upbnd.drawRect(0,0,app.renderer.width,Math.floor(cell_height*0.1))
    let ltbnd = new PIXI.Graphics();
    ltbnd.beginFill(0x000000)
    ltbnd.drawRect(0,0,Math.floor(cell_width*0.1),app.renderer.height)
    app.stage.addChild(upbnd)
    app.stage.addChild(ltbnd)
    // console.log(strval)
}
init();
const sizer = 40;
map_init(sizer,sizer);
maze_init2(sizer, sizer);
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