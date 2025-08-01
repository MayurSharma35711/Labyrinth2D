import { map_init } from "./bkgnd/mapgen.mjs";
import { maze_init2 } from "./bkgnd/mazegen.mjs";
import { print_map } from "./bkgnd/mapgen.mjs";
const app = new PIXI.Application();
const size = 40;
await app.init({ width: 1800, height: 900 });
document.body.appendChild(app.canvas);
let xrectnum = Math.floor(1800/size);
let yrectnum = Math.floor(900/size);
let game_map = map_init(xrectnum, yrectnum);
let game_maze = maze_init2(xrectnum, yrectnum);
await PIXI.Assets.load('../Textures/bkgnd/ShadowLands2.png');
await PIXI.Assets.load('../Textures/bkgnd/Desert2.png');
await PIXI.Assets.load('../Textures/bkgnd/GrassyPlains.png');
await PIXI.Assets.load('../Textures/bkgnd/Lava.png');
await PIXI.Assets.load('../Textures/bkgnd/MuddyRainforest2.png');
await PIXI.Assets.load('../Textures/bkgnd/PoisonOoze.png');
await PIXI.Assets.load('../Textures/bkgnd/RockyArea.png');
await PIXI.Assets.load('../Textures/bkgnd/SnowyIce.png');
await PIXI.Assets.load('../Textures/bkgnd/Waves2.png');
print_map(game_map, xrectnum, yrectnum);
function show_map(map)
{
    let sprite;
    for(let i = 0;i < yrectnum;i++)
    {
        for(let k = 0;k < xrectnum;k++)
        {
            switch(game_map[i * xrectnum + k].biome)
            {
            case 0:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/ShadowLands2.png');
                break;
            case 1:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/Desert2.png');
                break;
            case 2:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/GrassyPlains.png');
                break;
            case 3:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/Lava.png');
                break;
            case 4:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/MuddyRainforest2.png');
                break;
            case 5:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/PoisonOoze.png');
                break;
            case 6:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/RockyArea.png');
                break;
            case 7:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/SnowyIce.png');
                break;
            case 8:
                sprite = PIXI.Sprite.from('../Textures/bkgnd/Waves2.png');
                break;
            }
            sprite.x = k * size;
            sprite.y = i * size;
            sprite.width = size;
            sprite.height = size;
            app.stage.addChild(sprite);
        }
    }
}
show_map();