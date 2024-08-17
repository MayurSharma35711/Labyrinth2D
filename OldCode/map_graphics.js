import { maze_init2 } from "../SourceCode/bkgnd/mazegen.mjs";
import { print_walls } from "../SourceCode/bkgnd/mazegen.mjs";
import { print_map } from "../SourceCode/bkgnd/mapgen.mjs";
// import { multiBiomes } from "./bkgnd/mapgen.mjs";
import { map_init } from "../SourceCode/bkgnd/mapgen.mjs";
import { Monster, Player } from "../SourceCode/game_objs/entity_classes.mjs";
import { chest } from "../SourceCode/game_objs/equipment.mjs";
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
function chest_gen(chest_num, maze, width, height, cell_width, cell_height)
{
    let index;
    let ct;
    let chest_graph = new PIXI.Graphics();
    let chests = new Array(chest_num);
    for(let i = 0;i < height;i++)
    {
        for(let k = 0;k < width;k++)
        {
            ct = 0;
            index = 2 * (width * i + k);
            if(maze[index].getWall())
            {
                ct++;
            }
            if(index - 2 * width >= 0 && maze[index - 2 * width].getWall())
            {
                ct++;
            }
            if(maze[index + 1].getWall())
            {
                ct++;
            }
            if(index - 1 >= 0 && maze[index - 1].getWall())
            {
                ct++;
            }
            if(ct >= 3 && Math.floor(Math.random() * 6) == 1)
            {
              chest_graph.beginFill(0x9999FF);
              chest_graph.drawRect((index/2 % width) * cell_width + 0.25 * cell_width, Math.floor(index/(2 * width)) * cell_height + 0.25 * cell_height, cell_width/2, cell_height/2);
              app.stage.addChild(chest_graph);
              chests = new chest(k, i);
              // alert(i);
              // alert(k);
              chest_num--;
            }
            if(chest_num <= 0)
            {
              break;
            }
        }
        if(chest_num <= 0)
        {
          break;
        }
    }
    return chests;
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
init();
const sizer = 40;
// const cell_num = Math.floor((app.renderer.width * app.renderer.height)/(sizer * sizer));
// const cell_size = cell_width*cell_height;
let xrectnum = Math.floor(app.renderer.width / sizer);
let yrectnum = Math.floor(app.renderer.height / sizer) + 1;

let game_map = map_init(xrectnum,yrectnum);
// print_map(game_map, xrectnum, yrectnum)

map_draw(game_map, sizer, sizer)

let game_maze = maze_init2(xrectnum, yrectnum);
print_walls(game_maze, xrectnum, yrectnum);
maze_draw(game_maze, sizer, sizer)
let a = new Player(sizer, sizer);
// drawPlayer(sizer/2, sizer/2, 0xFF0000, sizer, sizer, a.x, a.y);
// game_map[1].drawTile(sizer, sizer);
// app.stage.addChild(game_map[1].tile_image);
// game_map[xrectnum].drawTile(sizer, sizer);
// app.stage.addChild(game_map[xrectnum].tile_image);
let arect = new PIXI.Graphics();
arect.beginFill(0xFF0000);
arect.lineStyle(5, 0xFFFFFF);
arect.drawRect(a.x * sizer, a.y * sizer, sizer/2, sizer/2);
app.stage.addChild(arect);
chest_gen(30, game_maze, xrectnum, yrectnum, sizer, sizer)
function visibility(currx, curry, vis)
{
  let currindex = curry * xrectnum + currx;
  // alert(currindex);
  if(game_map[currindex].rendered == false)
  {
    // alert(game_map[currindex].rendered);
    game_map[currindex].rendered = true;
    game_map[currindex].drawTile(sizer, sizer);
    app.stage.addChild(game_map[currindex].tile_image);
  }
  for(let i = 0;i < vis;i++)
  {
    for(let k = 0;k < vis;k++)
    {
      // alert(game_map[currindex + i * xrectnum + k].rendered);
      if(currx + k < xrectnum && curry + i < yrectnum && game_map[currindex + i * xrectnum + k].rendered == false)
      {
        game_map[currindex + i * xrectnum + k].rendered = true;
        game_map[currindex + i * xrectnum + k].drawTile(sizer, sizer);
        app.stage.addChild(game_map[currindex + i * xrectnum + k].tile_image);
        // alert(i);
        // alert(k)
      }
      // if(currx - k >= 0 && curry + i < yrectnum && game_map[currindex + i * xrectnum + k].rendered == false)
      // {
      //   game_map[currindex + i * xrectnum - k].rendered = true;
      //   game_map[currindex + i * xrectnum - k].drawTile(sizer, sizer);
      //   app.stage.addChild(game_map[currindex + i * xrectnum - k].tile_image);
      // }
      // if(currx + k < xrectnum && curry - i >= 0 && game_map[currindex - i * xrectnum + k].rendered == false)
      // {
      //   game_map[currindex - i * xrectnum + k].rendered = true;
      //   game_map[currindex - i * xrectnum + k].drawTile(sizer, sizer);
      //   app.stage.addChild(game_map[currindex - i * xrectnum + k].tile_image);
      // }
      // if(currx - k >= 0 && curry - i >= 0 && game_map[currindex - i * xrectnum - k].rendered == false)
      // {
      //   game_map[currindex - i * xrectnum - k].rendered = true;
      //   game_map[currindex - i * xrectnum - k].drawTile(sizer, sizer);
      //   app.stage.addChild(game_map[currindex - i * xrectnum - k].tile_image);
      // }
    }
  }
  for(let i = 0;i < vis;i++)
  {
    for(let k = 0;k < vis;k += 2)
    {
      // alert(game_maze[2 * (currindex + i * xrectnum + k)].rendered);
      if (game_maze[2 * (currindex + i * xrectnum + k)].getWall() && game_maze[2 * (currindex + i * xrectnum + k)].rendered == false)
      {
        game_maze[2 * (currindex + i * xrectnum + k)].rendered = true;
        game_maze[2 * (currindex + i * xrectnum + k)].drawWall(sizer, sizer);
        app.stage.addChild(game_maze[2 * (currindex + i * xrectnum + k)].wall_image);
      }
      if (game_maze[2 * (currindex + i * xrectnum + k) + 1].getWall() && game_maze[2 * (currindex + i * xrectnum + k) + 1].rendered == false)
      {
        game_maze[2 * (currindex + i * xrectnum + k) + 1].rendered = true;
        game_maze[2 * (currindex + i * xrectnum + k) + 1].drawWall(sizer, sizer);
        app.stage.addChild(game_maze[2 * (currindex + i * xrectnum + k) + 1].wall_image);
      }
    }
  }
  // maze_draw(game_maze, sizer, sizer);
}
// game_map[0].drawTile(sizer, sizer);
// app.stage.addChild(game_map[0].tile_image);
// let time;
// let prevtime;
// let timenow;
document.addEventListener('keydown', keyStart);
let left = 37;
let up = 38;
let right = 39;
let down = 40;
// let endrect = new PIXI.Graphics();
// endrect.beginFill(0xFF00FF);
// endrect.drawRect(Math.floor(xrectnum/2) * sizer, Math.floor(yrectnum/2) * sizer, sizer, sizer);
// app.stage.addChild(endrect);
// let parent = new PIXI.Graphics();
let x = 0;
let vis = 4;
function keyStart(e)
{
  // alert("Here");
  let key = e.keyCode;
  // alert(key);
  let currx = Math.floor(arect.x/sizer);
  let curry = Math.floor(arect.y/sizer);
  // game_map[curry * xrectnum + currx].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[curry * xrectnum + currx].tile_image);
  // arect.beginFill(0xFF0000);
  // arect.lineStyle(5, 0xFFFFFF);
  // arect.drawRect(arect.x, arect.y, sizer/2, sizer/2);
  // app.stage.addChild(arect);
  // game_map[curry * xrectnum + currx + 1].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[curry * xrectnum + currx + 1].tile_image);
  // game_map[curry * xrectnum + currx - 1].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[curry * xrectnum + currx - 1].tile_image);
  // game_map[(curry - 1) * xrectnum + currx + 1].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[(curry - 1) * xrectnum + currx + 1].tile_image);
  // game_map[(curry + 1) * xrectnum + currx + 1].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[(curry + 1) * xrectnum + currx + 1].tile_image);
  // game_map[curry * xrectnum + currx].drawTile(sizer, sizer);
  // app.stage.addChild(game_map[curry * xrectnum + currx].tile_image);


  // if(currx - 1 >= 0 && !(game_map[curry * xrectnum + currx - 1].rendered == true))
  // {
  //   // alert("HERE");
  //   game_map[curry * xrectnum + currx - 1].drawTile(sizer, sizer);
  //   app.stage.addChild(game_map[curry * xrectnum + currx - 1].tile_image);
  //   game_map[curry * xrectnum + currx - 1].rendered = true;
  // }
  // if(currx + 1 <= xrectnum && !(game_map[curry * xrectnum + currx + 1].rendered == true))
  // {
  //   game_map[curry * xrectnum + currx + 1].drawTile(sizer, sizer);
  //   app.stage.addChild(game_map[curry * xrectnum + currx + 1].tile_image);
  //   game_map[curry * xrectnum + currx + 1].rendered = true;
  // }
  // if(curry - 1 >= 0 && !(game_map[(curry - 1) * xrectnum + currx].rendered == true))
  // {
  //   game_map[(curry - 1) * xrectnum + currx].drawTile(sizer, sizer);
  //   app.stage.addChild(game_map[(curry - 1) * xrectnum + currx + 1].tile_image);
  //   game_map[(curry - 1) * xrectnum + currx].rendered = true;
  // }
  // if(curry + 1 <= yrectnum && !(game_map[(curry + 1) * xrectnum + currx].rendered == true))
  // {
  //   game_map[(curry + 1) * xrectnum + currx].drawTile(sizer, sizer);
  //   app.stage.addChild(game_map[(curry + 1) * xrectnum + currx].tile_image);
  //   game_map[(curry - 1) * xrectnum + currx].rendered = true;
  // }
  // visibility(currx, curry, vis);
  app.stage.addChild(arect);
  if(key == left && !game_maze[curry * 2 * xrectnum + currx * 2 - 1].getWall())
  {
    arect.x -= sizer;
  }
  else if(key == up && !game_maze[(curry - 1) * 2 * xrectnum + currx * 2].getWall())
  {
    arect.y -= sizer;
  }
  else if(key == right && !game_maze[curry * 2 * xrectnum + currx * 2 + 1].getWall())
  {
    arect.x += sizer;
  }
  else if(key == down && !game_maze[(curry) * 2 * xrectnum + currx * 2].getWall())
  {
    arect.y += sizer;
  }
  // maze_draw(game_maze, sizer, sizer);
  // if(dist(arect.x, arect.y, endrect.x, endrect.y) < 1)
  // {
  //   alert("End");
  // }
  // parent.addChild(game_map[(curry - 3) * xrectnum + currx]);
}

// while(a.health > 0)
// {

//   // Update loop
//   arect.x += sizer;
//   // app.render(app.stage);
//   a.health--; //This is just for testing porpuses
// }
// let a = new Player(sizer, sizer)
// a.move(5, -5);
// a.move(3, -2);
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