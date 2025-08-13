import { pause, pop_up } from "../../vis_updated.mjs";
import { tot_player_health, players, ptr, game_maze, xrectnum, yrectnum, app, seen_indices, play_inds } from "../../vis_updated.mjs";
import { get_view_sqr } from "../graphics/visibility.mjs";

// export let screen = new PIXI.Container();
// screen.backgroundColor = 0x0000FF

// export function update_stat_screen (entity){
//     // screen.backgroundColor = 0x0000FF
//     const clone_image = structuredClone(entity.sprite);
//     clone_image.width = 100
//     clone_image.height = 100
//     clone_image.x = entity.sprite.width / 10 + base_x;
//     clone_image.x = entity.sprite.height / 5 + base_y;

//     screen.addChild(clone_image);
//     app.stage.addChild(screen);
// }

// let p1 = new Player(1, 50, 50, 2) 
// p1.drawMe(50,50,0,0)

// display_screen(p1)

export function make_pop_up_menu(sizex, sizey, text){
    // most of this code was directly copied from the Google response
    const pop_up_container = new PIXI.Container();
    pop_up_container.position.set(app.screen.width / 2, app.screen.height / 2); // Center the menu
    pop_up_container.pivot.set(pop_up_container.width / 2, pop_up_container.height / 2); // Set pivot for centering
    
    const border_rect = new PIXI.Graphics();
    border_rect.rect(-sizex / 2 - 5, -sizey / 2 - 5, sizex + 10, sizey + 10);
    border_rect.fill(0x000000);
    pop_up_container.addChild(border_rect)

    const bkg_rect = new PIXI.Graphics();
    bkg_rect.rect(-sizex / 2, -sizey / 2, sizex, sizey);
    bkg_rect.fill(0xBB9490);
    pop_up_container.addChild(bkg_rect)

    const text_inside = new PIXI.Text(text, {
        fontFamily: 'Arial',
        fontSize: 15,
        fill: 0xffffff,
    });

    text_inside.anchor.set(0.5); // Center the text within its bounds
    text_inside.position.y = -sizey / 4; // Position relative to menuContainer's center
    pop_up_container.addChild(text_inside);

    pop_up.item = true
    // text_inside.on('pointerdown', () => {
    //     console.log('Play button clicked!');
    //     pause.item = false
    //     pop_up_container.visible = false
    //     // Add logic to start game or transition to another scene
    // });

    return pop_up_container
}
