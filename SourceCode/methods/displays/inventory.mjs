import { app, tot_height, tot_width } from "../../vis_updated.mjs";


export function create_inventory_screen(){
    // most of this code was directly copied from the Google response
    const inventory_screen = new PIXI.Container();
    pop_up_container.position.set(app.screen.width / 2, app.screen.height / 2); // Center the menu
    pop_up_container.pivot.set(pop_up_container.width / 2, pop_up_container.height / 2); // Set pivot for centering
    
    let sizex = tot_width * 4/5
    let sizey = tot_height * 4/5


    const border_rect = new PIXI.Graphics();
    border_rect.rect(-sizex / 2 - 5, -sizey / 2 - 5, sizex + 10, sizey + 10);
    border_rect.fill(0x000000);
    pop_up_container.addChild(border_rect)

    const bkg_rect = new PIXI.Graphics();
    bkg_rect.rect(-sizex / 2, -sizey / 2, sizex, sizey);
    bkg_rect.fill(0xABA4A0);
    pop_up_container.addChild(bkg_rect)

    const text_inside = new PIXI.Text(text, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
    });

    text_inside.anchor.set(0.5); // Center the text within its bounds
    text_inside.position.y = 0; // Position relative to menuContainer's center
    // pop_up_container.addChild(text_inside);

    // pop_up.item = true
    // text_inside.on('pointerdown', () => {
    //     console.log('Play button clicked!');
    //     pause.item = false
    //     pop_up_container.visible = false
    //     // Add logic to start game or transition to another scene
    // });

    return pop_up_container
}
