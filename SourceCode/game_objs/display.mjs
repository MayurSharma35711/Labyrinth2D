// export let screen = new PIXI.Container();
// screen.backgroundColor = 0x0000FF

import { Player } from "./player.mjs";

const app = new PIXI.Application();

function display_screen (entity){
    let screen = new PIXI.Container();
    screen.backgroundColor = 0x0000FF
    const clone_image = structuredClone(entity.rect);
    clone_image.width = 100
    clone_image.height = 100
    clone_image.x = entity.width / 10
    clone_image.x = entity.height / 5

    screen.addChild(clone_image)
    app.stage.addChild(screen);
}

let p1 = new Player(1, 50, 50, 2)
p1.drawMe(50,50,0,0)

display_screen(p1)