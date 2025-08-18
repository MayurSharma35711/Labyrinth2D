import { pause } from "../../vis_updated.mjs";
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

export function init_pause_menu(app){
    // most of this code was directly copied from the Google response
    const menuContainer = new PIXI.Container();
    menuContainer.position.set(app.screen.width / 2, app.screen.height / 2); // Center the menu
    menuContainer.pivot.set(menuContainer.width / 2, menuContainer.height / 2); // Set pivot for centering
    
    const bkg_rect = new PIXI.Graphics();
    bkg_rect.rect(-100, -100, 200, 200);
    bkg_rect.fill(0x3366FF);
    menuContainer.addChild(bkg_rect)

    // Example: Text button
    const playButton = new PIXI.Text('Play Game', {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: 0xffffff,
    });
    playButton.anchor.set(0.5); // Center the text within its bounds
    playButton.position.y = -50; // Position relative to menuContainer's center
    menuContainer.addChild(playButton);

    // Example: Another button
    const optionsButton = new PIXI.Text('Options', {
        fontFamily: 'Arial',
        fontSize: 36,
        fill: 0xffffff,
    });
    optionsButton.anchor.set(0.5);
    optionsButton.position.y = 50;
    menuContainer.addChild(optionsButton);



    playButton.interactive = true;
    playButton.buttonMode = true; // Changes cursor on hover

    playButton.on('pointerdown', () => {
        console.log('Play button clicked!');
        pause.item = false
        menuContainer.visible = false
        // Add logic to start game or transition to another scene
    });

    optionsButton.interactive = true;
    optionsButton.buttonMode = true;

    optionsButton.on('pointerdown', () => {
        console.log('Options button clicked!');
        // Add logic to open options menu
    });

    return menuContainer
}

export function init_player_card(player, sizex, sizey) {
    const player_card = new PIXI.Container()
    let index = player.player_ind
    let namer = player.name
    let spriter = player.sprite

    
    // this contains the player name, player sprite, player health bar, and maybe some of their status effects 
    // probably need to make a class just for status effects
    
}


export function init_health_bars(app, players){
    const health_bars = new PIXI.Container();
    health_bars.position.set(app.screen.width / 10, app.screen.height * 9 / 10); // Center the menu
    
    let indiv_bars = []
    let each_health_bar = []
    for(let i = 0; i < players.length; i++) {
        const ind_bar = new PIXI.Container()

        const bndy_rect = new PIXI.Graphics();
        bndy_rect.rect(-app.screen.width / 15 - app.screen.width / 400, -app.screen.width / 10 + 2 * i * app.screen.width / 80 - app.screen.width / 400 
            , app.screen.width / 8 + app.screen.width / 200, app.screen.width / 70 + app.screen.width / 200);
        bndy_rect.fill(0x000000);
        // bkg_rect.lineStyle(100, 0x000000, 1)
        // health_bars.addChild(bndy_rect)

        const bkg_rect = new PIXI.Graphics();
        bkg_rect.rect(-app.screen.width / 15, -app.screen.width / 10 + 2 * i * app.screen.width / 80 , app.screen.width / 8, app.screen.width / 70);
        bkg_rect.fill(0x33FF66);
        // bkg_rect.lineStyle(100, 0x000000, 1)
        // health_bars.addChild(bkg_rect)

        const health_rect = new PIXI.Graphics();
        health_rect.rect(-app.screen.width / 15 + app.screen.width / 200, -app.screen.width / 10 + 2 * i * app.screen.width / 80 + app.screen.width / 420, 
            (app.screen.width / 8 - app.screen.width / 100) * players[i].health / 10, app.screen.width / 105);
        //  ; ;  
        health_rect.fill(0xFF3366);
        // health_bars.addChild(health_rect)

        ind_bar.addChild(bndy_rect)
        ind_bar.addChild(bkg_rect)
        ind_bar.addChild(health_rect)
        health_bars.addChild(ind_bar)
        indiv_bars.push(ind_bar)
        each_health_bar.push(health_rect)
    }
    // console.log(health_bars)
    return [health_bars, indiv_bars, each_health_bar]
}


export function update_health_bars(){
    let play_visible = []
    for (let l = 0; l < players.length; l++) {
        play_visible.push(seen_indices.item.includes(play_inds[l]))
    }
    let indiv_bars = tot_player_health[1]
    let indiv_health = tot_player_health[2]
    // console.log(play_visible)
    // console.log(ptr)
    for (let k = 0; k < players.length; k++) {
        indiv_bars[k].visible = play_visible[k]
        let init_width = indiv_health[k].width
        indiv_health[k].width = Math.max(0, (app.screen.width / 8 - app.screen.width / 100) * players[k].health / 10)
        indiv_health[k].x = indiv_health[k].x - (init_width - indiv_health[k].width) / 2
    }
    app.stage.removeChild(tot_player_health[0])
    app.stage.addChild(tot_player_health[0])
}