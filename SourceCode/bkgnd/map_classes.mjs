import { maze_creator } from "./mazegen.mjs";
import { print_walls } from "./mazegen.mjs";
import { print_map } from "./mapgen.mjs";
import { multiBiomes } from "./mapgen.mjs";


const sizer = 40;
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