import { pause, inventory, tot_cards, inventory_screen } from "../../vis_updated.mjs";
import { players, ptr, game_maze, xrectnum, yrectnum, app, seen_indices, play_inds } from "../../vis_updated.mjs";
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


export function init_all_player_cards(players, locx, locy, sizex, sizey) {
    const player_info = new PIXI.Container()
    player_info.position.set(0, 0)
    player_info.pivot.set(player_info.width / 2, player_info.height / 2)
    
    let cards = []
    let health_bars = []
    let name_text = []
    let stepcounters = []
    for (let l = 0; l < players.length; l++) {
        let index = players[l].player_ind
        let output = init_player_card(players[l], locx + index * (sizex) * 1 - 2 * sizex + 0.1*sizex, locy, 0.9 * sizex, 0.9*sizey)
        cards.push(output[0])
        health_bars.push(output[1])
        name_text.push(output[2])
        stepcounters.push(output[3])
        player_info.addChild(output[0])
    }
    
    return [player_info, cards, health_bars, name_text, stepcounters]
}


export function init_player_card(player, locx, locy, sizex, sizey) {
    const player_card = new PIXI.Container()
    // let index = player.player_ind
    let namer = player.name
    let spriter = player.sprite
    player_card.position.set(locx, locy); // Center the menu
    player_card.pivot.set(player_card.width / 2, player_card.height / 2);

    let health_bar = init_health_bar(player, sizex / 2 + sizex / 30 ,  sizey, sizex, sizey)

    const bndy_rect = new PIXI.Graphics();
    bndy_rect.rect(0, 0, sizex, sizey);
    bndy_rect.fill(0x0000FF, 0.5);
    player_card.addChild(bndy_rect)

    bndy_rect.interactive = true;
    bndy_rect.buttonMode = true; // Changes cursor on hover

    bndy_rect.on('pointerdown', () => {
        // console.log('Play button clicked!');
        inventory.item = true
        inventory_screen.item.visible = true
        app.stage.removeChild(inventory_screen.item)
        app.stage.addChild(inventory_screen.item)
        // console.log("here")
        // Add logic to start game or transition to another scene
    });
    
    player_card.addChild(health_bar[0])

    // player_card.addChild(spriter)
    let speeder = " 0/"
    speeder = speeder + player.speed
    // console.log(typeof(player.speed))
    // console.log(player.speed)

    const player_name = new PIXI.Text( namer, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
    });
    player_name.anchor.set(0); // Center the text within its bounds
    player_name.position.y = sizey * 2 / 24; // Position relative to menuContainer's center
    player_name.position.x = sizex / 20
    player_card.addChild(player_name);

    const stepper = new PIXI.Text(speeder, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0x00ff00,
    });
    stepper.anchor.set(1,0); // Center the text within its bounds
    stepper.position.y = sizey * 2 / 24; // Position relative to menuContainer's center
    stepper.position.x = sizex * 19 / 20
    player_card.addChild(stepper);

    return [player_card, health_bar[1], player_name, stepper]
    // this contains the player name, player sprite, player health bar, and maybe some of their status effects 
    // probably need to make a class just for status effects
    
}


function init_health_bar(player, locx, locy, sizex, sizey){
    const health_bar = new PIXI.Container();
    health_bar.position.set(locx, locy); // Center the menu
    health_bar.pivot.set(health_bar.width / 2, health_bar.height / 2);
    
    // let indiv_bars = []
    // let each_health_bar = []

    
    
    // const ind_bar = new PIXI.Container()health_bar

    const bndy_rect = new PIXI.Graphics();
    bndy_rect.rect(-app.screen.width / 15 - app.screen.width / 400, -app.screen.width / 10 - app.screen.width / 400 
        , app.screen.width / 8 + app.screen.width / 200, app.screen.width / 70 + app.screen.width / 200);
    bndy_rect.fill(0x000000);
    // bkg_rect.lineStyle(100, 0x000000, 1)
    // health_bars.addChild(bndy_rect)

    const bkg_rect = new PIXI.Graphics();
    bkg_rect.rect(-app.screen.width / 15, -app.screen.width / 10 , app.screen.width / 8, app.screen.width / 70);
    bkg_rect.fill(0x33FF66);
    // bkg_rect.lineStyle(100, 0x000000, 1)
    // health_bars.addChild(bkg_rect)

    const health_rect = new PIXI.Graphics();
    health_rect.rect(-app.screen.width / 15 + app.screen.width / 200, -app.screen.width / 10 + app.screen.width / 420, 
        (app.screen.width / 8 - app.screen.width / 100) * player.health / 10, app.screen.width / 105);
    //  ; ;  
    health_rect.fill(0xFF3366);
    // health_bars.addChild(health_rect)

    health_bar.addChild(bndy_rect)
    health_bar.addChild(bkg_rect)
    health_bar.addChild(health_rect)

    // health_bar.addChild(ind_bar)
    // indiv_bars.push(ind_bar)
    // each_health_bar.push(health_rect)
    
    // console.log(health_bars)
    return [health_bar, health_rect]
}


export function update_player_cards(){
    let play_visible = []
    for (let l = 0; l < players.length; l++) {
        play_visible.push(seen_indices.item.includes(play_inds[l]))
    }
    let indiv_cards = tot_cards.item[1]
    let indiv_health = tot_cards.item[2]
    let indiv_names = tot_cards.item[3]
    let indiv_steps = tot_cards.item[4]
    // console.log(play_visible)
    // console.log(ptr)
    for (let k = 0; k < players.length; k++) {
        indiv_cards[k].visible = play_visible[k]
        indiv_steps[k].text = players[k].blks_moved + "/" + players[k].speed
        console.log(indiv_steps[k])
        if (players[k].blks_moved > players[k].speed / 2 && players[k].blks_moved <= players[k].speed - 2) {
            indiv_steps[k].style.fill = 0xffff00
        } 
        else if (players[k].blks_moved > players[k].speed - 2) {
            indiv_steps[k].style.fill = 0xff0000
        } 
        else {
            indiv_steps[k].style.fill = 0x00ff00
        }
        let init_width = indiv_health[k].width
        indiv_health[k].width = Math.max(0, (app.screen.width / 8 - app.screen.width / 100) * players[k].health / 10)
        indiv_health[k].x = indiv_health[k].x - (init_width - indiv_health[k].width) / 2
    }
    app.stage.removeChild(tot_cards.item[0])
    app.stage.addChild(tot_cards.item[0])
}