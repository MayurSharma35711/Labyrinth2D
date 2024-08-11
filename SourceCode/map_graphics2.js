import { maze_init2 } from "./bkgnd/mazegen.mjs";
import { print_walls } from "./bkgnd/mazegen.mjs";
import { print_map } from "./bkgnd/mapgen.mjs";
// import { multiBiomes } from "./bkgnd/mapgen.mjs";
import { map_init } from "./bkgnd/mapgen.mjs";
import { Monster, Player } from "./game_objs/entity_classes.mjs";
// import { map_draw } from "./bkgnd/mapgen.mjs";

// ------------------------- INITIALIZE -----------------
var app;

function dist(x1, x2, y1, y2)
{
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2) 
}
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
function drawPlayer(length, width, color, cell_sizex, cell_sizey, x, y)
{
    let rect = new PIXI.Graphics();
    rect.beginFill(color);
    rect.lineStyle(5 , 0xFFFFFF);
    rect.drawRect(x * cell_sizex, y * cell_sizey, length, width);
    app.stage.addChild(rect);
    requestAnimationFrame(rect);
}
function map_draw(map, cell_width, cell_height) {
	// for (let i = 0; i < cell_num + xrectnum + 1; i++){
	for (let i = 0; i < map.length; i++){
    // console.log(map[i].getBiome())
    map[i].drawTile(cell_width, cell_height)
    app.stage.addChild(map[i].tile_image);
	}
}

function maze_draw(maze, cell_width, cell_height) {
  for (let i =0; i < maze.length; i++) {
    if (maze[i].getWall()){
      maze[i].drawWall(cell_width, cell_height)
      app.stage.addChild(maze[i].wall_image)
    }
  }
  let upbnd = new PIXI.Graphics();
  upbnd.beginFill(0x000000)
  upbnd.drawRect(0,0,app.renderer.width,Math.floor(cell_height*0.1))
  let ltbnd = new PIXI.Graphics();
  ltbnd.beginFill(0x000000)
  ltbnd.drawRect(0,0,Math.floor(cell_width*0.1),app.renderer.height)
  let dwbnd = new PIXI.Graphics();
  dwbnd.beginFill(0x000000)
  dwbnd.drawRect(0,app.renderer.height-Math.floor(cell_height*0.1),app.renderer.width,Math.floor(cell_height*0.1))
  let rtbnd = new PIXI.Graphics();
  rtbnd.beginFill(0x000000)
  rtbnd.drawRect(app.renderer.width-Math.floor(cell_width*0.1),0,Math.floor(cell_width*0.1),app.renderer.height)
  app.stage.addChild(upbnd)
  app.stage.addChild(ltbnd)
  app.stage.addChild(dwbnd)
  app.stage.addChild(rtbnd)
}


function keyStart(e)
{
    let key = e.keyCode;
    let left = 37;
    let up = 38;
    let right = 39;
    let down = 40;
    // alert(key);
    let currx = Math.floor(a.arect.x/sizer);
    let curry = Math.floor(a.arect.y/sizer);
    app.stage.addChild(a.arect);
    let changex = 0
    let changey = 0
    if(key == left && !game_maze[curry * 2 * xrectnum + currx * 2 - 1].getWall())
    {
        changex = -sizer;
    }
    else if(key == up && !game_maze[(curry - 1) * 2 * xrectnum + currx * 2].getWall())
    {
        changey = -sizer;
    }
    else if(key == right && !game_maze[curry * 2 * xrectnum + currx * 2 + 1].getWall())
    {
        changex = sizer;
    }
    else if(key == down && !game_maze[(curry) * 2 * xrectnum + currx * 2].getWall())
    {
        changey = sizer;
    }
    if (changex - changey != 0) {
        const m1mv = Math.random()
        let m1changey = 0
        let m1changex = 0
        if (m1mv < 0.25)
            m1changey = -sizer
        else if (m1mv < 0.5)
            m1changey = sizer
        else if (m1mv < 0.75)
            m1changex = -sizer
        else
            m1changex = sizer
        a.arect.x += changex
        a.arect.y += changey
        m1.arect.x += m1changex
        m1.arect.y += m1changey
    }
}



init();
const sizer = 40;
// const cell_num = Math.floor((app.renderer.width * app.renderer.height)/(sizer * sizer));
// const cell_size = cell_width*cell_height;
let xrectnum = 10;
let yrectnum = 10;

let game_map = map_init(xrectnum,yrectnum);
// print_map(game_map, xrectnum, yrectnum)

map_draw(game_map, sizer, sizer)

let game_maze = maze_init2(xrectnum, yrectnum);
// print_walls(game_maze, xrectnum, yrectnum);
maze_draw(game_maze, sizer, sizer)
let a = new Player(sizer, sizer);

app.stage.addChild(a.arect);

let m1 = new Monster(2, sizer, sizer, xrectnum, yrectnum);
app.stage.addChild(m1.arect)
// a.drawMe(sizer,sizer)

document.addEventListener('keydown', keyStart);
