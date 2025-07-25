// export let screen = new PIXI.Container();
// screen.backgroundColor = 0x0000FF

export function update_stat_screen (entity){
    // screen.backgroundColor = 0x0000FF
    const clone_image = structuredClone(entity.sprite);
    clone_image.width = 100
    clone_image.height = 100
    clone_image.x = entity.sprite.width / 10 + base_x;
    clone_image.x = entity.sprite.height / 5 + base_y;

    screen.addChild(clone_image);
    app.stage.addChild(screen);
}

let p1 = new Player(1, 50, 50, 2)
p1.drawMe(50,50,0,0)

display_screen(p1)