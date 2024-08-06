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
class equipment{

}
class weapons{

}
function dist(x1, x2, y1, y2)
{
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2) 
}
class Entities{
    setpos(x, y)
    {
        this.x = x;
        this.y = y;
    }
    move(ax, ay)
    {
        // If wall is present cancel movement
        this.x += ax;
        this.y += ay;
    }
    takeDamage(damage)
    {
        this.health -= damage;
        if(this.health - damage <= 0)
        {
            delete this;
        }
    }
    dealDamage(damage, target)
    {
        if(dist(this.x, this.y, target.x, target.y) <= range)
        {
            this.health += 0.2 * damage;
            target.takeDamage(damage);
        }
    }
    setSpeed(speed)
    {
        this.speed = speed;
    }
    setStrength(strength)
    {
        this.strength = strength;
    }
    setHealth(health)
    {
        this.health = health;
    }
    setProt(durability, prot)
    {
        this.durability = durability;
        this.prot = prot;
    }
    setRange(range)
    {
        this.range = range;
    }
    drawMe(length, width, color, cell_sizex, cell_sizey)
    {
        let rect = new PIXI.Graphics();
        rect.beginFill(color);
        rect.lineStyle(5 , 0xFFFFFF);
        rect.drawRect(this.x * cell_sizex, this.y * cell_sizey, length, width);
        app.stage.addChild(rect);
    }
    printPos()
    {
        // alert(this.x);
        // alert(this.y);
    }
}
class Player extends Entities
{
    constructor(cell_sizex, cell_sizey)
    {
        // // alert("Here");
        super();
        // super();
        // console.log("hi")
        // super.printHello();
        // console.log("hi2")
        // setHealth(10);
        // // alert("0");
        // setHealth(10);
        // // alert("1");
        super.setSpeed(4);
        // // alert("2");
        super.setStrength(4);
        // // alert("3");
        super.setRange(1);
        // // alert("4");
        super.setProt(0, 0);
        // // alert("5");
        super.setpos(0.25, 0.25);
        // // alert("6");
        // super.move(10, 10);
        // super.printPos();
        super.drawMe(cell_sizex/2, cell_sizey/2, 0xFF0000, cell_sizex, cell_sizey);
        // // alert("7")
        // super.printHello();
        // // alert("8 = End");
    }
}
class Monster extends Entities
{
    constructor(tier, cell_sizex, cell_sizey)
    {
        super();
        super.setSpeed((6 - tier));
        super.setStrength(6 - tier);
        super.setRange(Math.floor(0.5 * (6 - tier)));
        super.setProt((6 - tier), (2 * (6 - tier)));
        super.setpos(Math.floor(Math.random() * app.renderer.width/cell_sizex), Math.floor(Math.random() * app.renderer.height/cell_sizey));
        let color;
        switch(tier)
        {
        case 1:
            color = 0xFF0000
            // // alert(color);
            break;
        case 2:
            color = 0x0000FF
            // // alert("2");
            // // alert(color);
            break;
        case 3:
            color = 0x00FF00
            // // alert(3)
            // // alert(color);
            break;
        // case 4:
        //     color = 0x888888
        //     // // alert(4)
        //     // // alert(color)
        //     break;
        // case 5:
        //     color = 0x111111
        //     // // alert(6);
        //     // // alert(color)
        //     break;
        default:
            // // alert("BAD");
            break;
        }
        // // alert(color);
        // // alert("Here");
        super.printPos();
        super.drawMe(cell_sizex/tier, cell_sizey/tier, color, cell_sizex, cell_sizey);
        // // alert("Out");
    }
}
function map_init(cell_width, cell_height) {
    
    const cell_num = Math.floor((app.renderer.width * app.renderer.height)/(cell_width * cell_height));
    // const cell_size = cell_width*cell_height;
    let xrectnum = Math.floor(app.renderer.width / cell_width) + 1;
    let yrectnum = Math.floor(app.renderer.height / cell_height) + 1;
    // // alert("broken?")
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
        //     // alert(map[i])




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
//     // alert("Before width");
//     let width = Math.floor(app.renderer.width / cell_width);
//     // alert("After width");
//     let height = Math.floor(app.renderer.height / cell_height);
//     // // alert("height = ", height, "length = ", width);
//     // alert(height);
//     // alert(width);
//     let length = height;
//     // alert(wall[0]);
//     // alert(wall[1]);
//     // alert(wall[2]);
//     // alert(wall[3]);
//     // alert(wall[4]);
//     let wall = maze_creator(width, height);
//     // // alert("After Wall");
//     let line;
//     let xrectnum = (app.renderer.width/width) + 1;
//     // alert(wall[0]);
//     // alert(wall[1]);
//     // alert(wall[2]);
//     // alert(wall[3]);
//     // alert(wall[4]);
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
    // // alert("broken?")
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
                // console.log(l,k)
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
const sizer = 60;
map_init(sizer,sizer);
maze_init2(sizer, sizer);
let a = new Player(sizer, sizer);
let b = new Monster(1, sizer, sizer);
let c = new Monster(2, sizer, sizer);
let d = new Monster(3, sizer, sizer);
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