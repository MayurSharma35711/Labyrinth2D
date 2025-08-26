import { pause, inventory, tot_cards, inventory_screen, curr_player_trues, curr_player_index } from "../../vis_updated.mjs";
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
    let staters = []
    let bndrects = []
    let coverrects = []

    cards.push([])
    health_bars.push([])
    name_text.push([])
    stepcounters.push([])
    staters.push([])
    bndrects.push([])
    coverrects.push([])

    for (let l = 0; l < players.length; l++) {
        let index = players[l].player_ind
        let output = init_small_player_card(players[l], locx + index * (sizex) * 1 - 2 * sizex + 0.1*sizex, locy, 0.9 * sizex, 0.9*sizey)
        cards[0].push(output[0])
        health_bars[0].push(output[1])
        name_text[0].push(output[2])
        stepcounters[0].push(output[3])
        staters[0].push(output[4])
        bndrects[0].push(output[5])
        coverrects[0].push(output[6])
        player_info.addChild(output[0])
    }

    cards.push([])
    health_bars.push([])
    name_text.push([])
    stepcounters.push([])
    staters.push([])
    bndrects.push([])
    coverrects.push([])

    for (let l = 0; l < players.length; l++) {
        let index = players[l].player_ind
        let output = init_medium_player_card(players[l], locx + index * (sizex) * 1 - 2 * sizex + 0.1*sizex, locy, 0.9 * sizex, 0.9*sizey)
        cards[1].push(output[0])
        health_bars[1].push(output[1])
        name_text[1].push(output[2])
        stepcounters[1].push(output[3])
        staters[1].push(output[4])
        bndrects[1].push(output[5])
        coverrects[1].push(output[6])
        player_info.addChild(output[0])
    }

    cards.push([])
    health_bars.push([])
    name_text.push([])
    stepcounters.push([])
    staters.push([])
    bndrects.push([])
    coverrects.push([])

    for (let l = 0; l < players.length; l++) {
        let index = players[l].player_ind
        let output = init_large_player_card(players[l], locx + index * (sizex) * 1 - 2 * sizex + 0.1*sizex, locy, 0.9 * sizex, 0.9*sizey)
        cards[2].push(output[0])
        health_bars[2].push(output[1])
        name_text[2].push(output[2])
        stepcounters[2].push(output[3])
        staters[2].push(output[4])
        bndrects[2].push(output[5])
        coverrects[2].push(output[6])
        player_info.addChild(output[0])
    }

    for (let l = 0; l < players.length; l++) {
        if(l == curr_player_index.item) {
            cards[0][l].visible = false
            cards[1][l].visible = true
        }
        else {
            cards[0][l].visible = true
            cards[1][l].visible = false
        }
        cards[2][l].visible = false

        bndrects[0][l].on('mouseover', () => {
            if(!inventory.item) {
                cards[0][l].visible = false
                cards[2][l].visible = true
                app.stage.removeChild(tot_cards.item[0])
                app.stage.addChild(tot_cards.item[0])
            }
        });
        bndrects[1][l].on('mouseover', () => {
            if(!inventory.item) {
                cards[1][l].visible = false
                cards[2][l].visible = true
                app.stage.removeChild(tot_cards.item[0])
                app.stage.addChild(tot_cards.item[0])
            }
        });
        bndrects[2][l].on('mouseout', () => {
            if (!inventory.item) {
                cards[2][l].visible = false
                cards[0][l].visible = !curr_player_trues.item[l]
                cards[1][l].visible = curr_player_trues.item[l]
            }
        })
    }
    
    return [player_info, cards, health_bars, name_text, stepcounters, staters, bndrects, coverrects]
}


function init_small_player_card(player, locx, locy, sizex, sizey) {
    const player_card = new PIXI.Container()
    // let index = player.player_ind
    let namer = player.name
    player_card.position.set(locx, locy); // Center the menu
    player_card.pivot.set(player_card.width / 2, player_card.height / 2);

    let health_bar = init_health_bar(player, sizex / 20 ,  sizey * 19 / 24, sizex * 18 / 20, sizey / 10)

    const bndy_rect = new PIXI.Graphics();
    bndy_rect.rect(0, 0, sizex, sizey);
    bndy_rect.fill(0x0000FF, 0.5);
    player_card.addChild(bndy_rect)

    const cover_rect = new PIXI.Graphics();
    cover_rect.rect(0, 0, sizex, sizey);
    cover_rect.fill(0x000000, 0.5);
    
    player_card.addChild(health_bar[0])

    // player_card.addChild(spriter)
    let speeder = " " + player.blks_moved + "/"
    speeder = speeder + player.speed
    // console.log(typeof(player.speed))
    // console.log(player.speed)

    const player_name = new PIXI.Text( namer, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
    });
    player_name.anchor.set(0); // Center the text within its bounds
    player_name.position.y = sizey * 1.5 / 24; // Position relative to menuContainer's center
    player_name.position.x = sizex / 20
    player_card.addChild(player_name);

    const player_stats = new PIXI.Text( "stats \neffects", {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0xffffff,
    });
    player_stats.anchor.set(0); // Center the text within its bounds
    player_stats.position.y = sizey * 8 / 24; // Position relative to menuContainer's center
    player_stats.position.x = sizex / 20
    player_card.addChild(player_stats);

    const stepper = new PIXI.Text(speeder, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0x00ff00,
    });
    stepper.anchor.set(1,0); // Center the text within its bounds
    stepper.position.y = sizey * 1.5 / 24; // Position relative to menuContainer's center
    stepper.position.x = sizex * 19 / 20
    player_card.addChild(stepper);

    const sprite_bkg = new PIXI.Graphics()
    sprite_bkg.rect(sizex * 13 / 20 , sizey * 7/24 , sizex * 6 / 20 , sizex * 6 / 20)
    // bndy_rect.rect(-app.screen.width / 15 - app.screen.width / 400, -app.screen.width / 10 - app.screen.width / 400 
    //     , app.screen.width / 8 + app.screen.width / 200, app.screen.width / 70 + app.screen.width / 200);
    sprite_bkg.fill(0xFFFFFF);
    player_card.addChild(sprite_bkg)

    const sprite = new PIXI.Sprite(player.sprite.texture)
    sprite.x = sizex * 13 / 20 + sizex * 1 / 40
    sprite.y = sizey * 7/24 + sizex * 1 / 40
    sprite.width = sizex * 5 / 20
    sprite.height = sizex * 5 / 20
    player_card.addChild(sprite)

    bndy_rect.interactive = true;
    bndy_rect.buttonMode = true; // Changes cursor on hover

    bndy_rect.on('pointerdown', () => {
        // console.log('Play button clicked!');
        inventory.item = true
        inventory_screen.item.visible = true

        let indiv_cards = tot_cards.item[1]
        let play_visible = []
        for (let l = 0; l < players.length; l++) {
            play_visible.push(seen_indices.item.includes(play_inds[l]))
        }
        for (let k = 0; k < players.length; k++) {
            indiv_cards[2][k].visible = false
            if(k == curr_player_index.item) {
                indiv_cards[0][k].visible = false
                indiv_cards[1][k].visible = play_visible[k]
            }
            else {
                indiv_cards[1][k].visible = false
                indiv_cards[0][k].visible = play_visible[k]
            }
        }

        app.stage.removeChild(inventory_screen.item)
        app.stage.addChild(inventory_screen.item)
        // console.log("here")
        // Add logic to start game or transition to another scene
    });

    player_card.addChild(cover_rect)
    cover_rect.visible = false
    return [player_card, health_bar[1], player_name, stepper, player_stats, bndy_rect, cover_rect]
    // this contains the player name, player sprite, player health bar, and maybe some of their status effects 
    // probably need to make a class just for status effects
    
}


function init_medium_player_card(player, locx, locy, sizex, sizey) {
    const player_card = new PIXI.Container()
    // let index = player.player_ind
    let namer = player.name
    player_card.position.set(locx, locy); // Center the menu
    player_card.pivot.set(player_card.width / 2, player_card.height / 2);

    let health_bar = init_health_bar(player, sizex / 20 ,  sizey * 19 / 24, sizex * 18 / 20, sizey / 10)

    const bndy_rect = new PIXI.Graphics();
    bndy_rect.rect(0, - 4 * sizey / 10, sizex, 1.4 * sizey);
    bndy_rect.fill(0x0000FF, 0.5);
    player_card.addChild(bndy_rect)

    const cover_rect = new PIXI.Graphics();
    cover_rect.rect(0, - 4 * sizey / 10, sizex, 1.4 * sizey);
    cover_rect.fill(0x000000, 0.5);
    
    player_card.addChild(health_bar[0])

    // player_card.addChild(spriter)
    let speeder = " " + player.blks_moved + "/"
    speeder = speeder + player.speed
    // console.log(typeof(player.speed))
    // console.log(player.speed)

    const player_name = new PIXI.Text( namer, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
    });
    player_name.anchor.set(0); // Center the text within its bounds
    player_name.position.y = sizey * 1.5 / 24 - 4 * sizey / 10; // Position relative to menuContainer's center
    player_name.position.x = sizex / 20
    player_card.addChild(player_name);

    const player_stats = new PIXI.Text( "stats \neffects", {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0xffffff,
    });
    player_stats.anchor.set(0); // Center the text within its bounds
    player_stats.position.y = sizey * 8 / 24 - 4 * sizey / 10; // Position relative to menuContainer's center
    player_stats.position.x = sizex / 20
    player_card.addChild(player_stats);

    const stepper = new PIXI.Text(speeder, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0x00ff00,
    });
    stepper.anchor.set(1,0); // Center the text within its bounds
    stepper.position.y = sizey * 1.5 / 24 - 4 * sizey / 10; // Position relative to menuContainer's center
    stepper.position.x = sizex * 19 / 20
    player_card.addChild(stepper);

    const sprite_bkg = new PIXI.Graphics()
    sprite_bkg.rect(sizex * 8 / 20 , sizey * 7/24 - 4 * sizey / 10, sizex * 11 / 20 , sizex * 11 / 20)
    // bndy_rect.rect(-app.screen.width / 15 - app.screen.width / 400, -app.screen.width / 10 - app.screen.width / 400 
    //     , app.screen.width / 8 + app.screen.width / 200, app.screen.width / 70 + app.screen.width / 200);
    sprite_bkg.fill(0xFFFFFF);
    player_card.addChild(sprite_bkg)

    const sprite = new PIXI.Sprite(player.sprite.texture)
    sprite.x = sizex * 8 / 20 + sizex * 1 / 40
    sprite.y = sizey * 7/24 + sizex * 1 / 40 - 4 * sizey / 10
    sprite.width = sizex * 10 / 20
    sprite.height = sizex * 10 / 20
    player_card.addChild(sprite)

    bndy_rect.interactive = true;
    bndy_rect.buttonMode = true; // Changes cursor on hover

    bndy_rect.on('pointerdown', () => {
        // console.log('Play button clicked!');
        inventory.item = true
        inventory_screen.item.visible = true

        let indiv_cards = tot_cards.item[1]
        let play_visible = []
        for (let l = 0; l < players.length; l++) {
            play_visible.push(seen_indices.item.includes(play_inds[l]))
        }
        for (let k = 0; k < players.length; k++) {
            indiv_cards[2][k].visible = false
            if(k == curr_player_index.item) {
                indiv_cards[0][k].visible = false
                indiv_cards[1][k].visible = play_visible[k]
            }
            else {
                indiv_cards[1][k].visible = false
                indiv_cards[0][k].visible = play_visible[k]
            }
        }

        app.stage.removeChild(inventory_screen.item)
        app.stage.addChild(inventory_screen.item)
        // console.log("here")
        // Add logic to start game or transition to another scene
    });

    player_card.addChild(cover_rect)
    cover_rect.visible = false
    return [player_card, health_bar[1], player_name, stepper, player_stats, bndy_rect, cover_rect]
    // this contains the player name, player sprite, player health bar, and maybe some of their status effects 
    // probably need to make a class just for status effects
    
}



function init_large_player_card(player, locx, locy, sizex, sizey) {
    const player_card = new PIXI.Container()
    // let index = player.player_ind
    let namer = player.name
    player_card.position.set(locx, locy); // Center the menu
    player_card.pivot.set(player_card.width / 2, player_card.height / 2);

    let health_bar = init_health_bar(player, sizex / 20 ,  sizey * 19 / 24, sizex * 18 / 20, sizey / 10)

    const bndy_rect = new PIXI.Graphics();
    bndy_rect.rect(0, - 1.5*sizey, sizex, 2.5 * sizey);
    bndy_rect.fill(0x0000FF, 0.5);
    player_card.addChild(bndy_rect)

    const cover_rect = new PIXI.Graphics();
    cover_rect.rect(0, - 1.5*sizey, sizex, 2.5 * sizey);
    cover_rect.fill(0x000000, 0.5);
    

    
    player_card.addChild(health_bar[0])

    // player_card.addChild(spriter)
    let speeder = " " + player.blks_moved + "/"
    speeder = speeder + player.speed
    // console.log(typeof(player.speed))
    // console.log(player.speed)

    const player_name = new PIXI.Text( namer, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff,
    });
    player_name.anchor.set(0); // Center the text within its bounds
    player_name.position.y = sizey * 1.5 / 24 - 1.5*sizey; // Position relative to menuContainer's center
    player_name.position.x = sizex / 20
    player_card.addChild(player_name);

    const player_stats = new PIXI.Text( "stats \neffects", {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: 0xffffff,
    });
    player_stats.anchor.set(0); // Center the text within its bounds
    player_stats.position.y = sizey * 8 / 24 - 1.5* sizey; // Position relative to menuContainer's center
    player_stats.position.x = sizex / 20
    player_card.addChild(player_stats);

    const stepper = new PIXI.Text(speeder, {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0x00ff00,
    });
    stepper.anchor.set(1,0); // Center the text within its bounds
    stepper.position.y = sizey * 1.5 / 24 - 1.5* sizey; // Position relative to menuContainer's center
    stepper.position.x = sizex * 19 / 20
    player_card.addChild(stepper);

    const sprite_bkg = new PIXI.Graphics()
    sprite_bkg.rect(sizex * 1 / 20 , sizey * 7/24 - sizey, sizex * 18 / 20 , sizex * 18 / 20)
    // bndy_rect.rect(-app.screen.width / 15 - app.screen.width / 400, -app.screen.width / 10 - app.screen.width / 400 
    //     , app.screen.width / 8 + app.screen.width / 200, app.screen.width / 70 + app.screen.width / 200);
    sprite_bkg.fill(0xFFFFFF);
    player_card.addChild(sprite_bkg)

    const sprite = new PIXI.Sprite(player.sprite.texture)
    sprite.x = sizex * 1 / 20 + sizex * 1 / 40
    sprite.y = sizey * 7/24 + sizex * 1 / 40 - sizey
    sprite.width = sizex * 17 / 20
    sprite.height = sizex * 17 / 20
    player_card.addChild(sprite)

    bndy_rect.interactive = true;
    bndy_rect.buttonMode = true; // Changes cursor on hover

    bndy_rect.on('pointerdown', () => {
        // console.log('Play button clicked!');
        inventory.item = true
        inventory_screen.item.visible = true

        let indiv_cards = tot_cards.item[1]
        let play_visible = []
        for (let l = 0; l < players.length; l++) {
            play_visible.push(seen_indices.item.includes(play_inds[l]))
        }
        for (let k = 0; k < players.length; k++) {
            indiv_cards[2][k].visible = false
            if(k == curr_player_index.item) {
                indiv_cards[0][k].visible = false
                indiv_cards[1][k].visible = play_visible[k]
            }
            else {
                indiv_cards[1][k].visible = false
                indiv_cards[0][k].visible = play_visible[k]
            }
        }

        app.stage.removeChild(inventory_screen.item)
        app.stage.addChild(inventory_screen.item)
        // console.log("here")
        // Add logic to start game or transition to another scene
    });

    player_card.addChild(cover_rect)
    cover_rect.visible = false

    return [player_card, health_bar[1], player_name, stepper, player_stats, bndy_rect, cover_rect]
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
    bndy_rect.rect(-1,-1, sizex + 2, sizey + 2)
    // bndy_rect.rect(-app.screen.width / 15 - app.screen.width / 400, -app.screen.width / 10 - app.screen.width / 400 
    //     , app.screen.width / 8 + app.screen.width / 200, app.screen.width / 70 + app.screen.width / 200);
    bndy_rect.fill(0x000000);
    // bkg_rect.lineStyle(100, 0x000000, 1)
    // health_bars.addChild(bndy_rect)

    const bkg_rect = new PIXI.Graphics();
    bkg_rect.rect(0,0, sizex, sizey)
    // bkg_rect.rect(-app.screen.width / 15, -app.screen.width / 10 , app.screen.width / 8, app.screen.width / 70);
    bkg_rect.fill(0xFF99BB);
    // bkg_rect.lineStyle(100, 0x000000, 1)
    // health_bars.addChild(bkg_rect)

    const health_rect = new PIXI.Graphics();
    health_rect.rect(0 , 0, sizex * player.health / 10, sizey)
    // health_rect.rect(-app.screen.width / 15 + app.screen.width / 200, -app.screen.width / 10 + app.screen.width / 420, 
    //     (app.screen.width / 8 - app.screen.width / 100) * player.health / 10, app.screen.width / 105);
    //  ; ;  
    health_rect.fill(0xFF3366)
    // health_rect.fill(0x0000ff)
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
    let indiv_stats = tot_cards.item[5]
    let indiv_bnds = tot_cards.item[6]
    let indiv_covers = tot_cards.item[7]
    // console.log(play_visible)
    // console.log(ptr)
    
    // UPDATE THE INFO ON EVERY SINGLE CARD FIRST
    for (let l = 0; l < 3; l++) {
        for (let k = 0; k < players.length; k++) {
            indiv_steps[l][k].text = players[k].blks_moved + "/" + players[k].speed
            // console.log(indiv_steps[k])
            if (players[k].blks_moved > players[k].speed / 2 && players[k].blks_moved <= players[k].speed - 2) {
                indiv_steps[l][k].style.fill = 0xffff00
            } 
            else if (players[k].blks_moved > players[k].speed - 2) {
                indiv_steps[l][k].style.fill = 0xff0000
            } 
            else {
                indiv_steps[l][k].style.fill = 0x00ff00
            }
            let init_width = indiv_bnds[l][k].width * 18 / 20
            indiv_health[l][k].width = Math.max(0, init_width * players[k].health / 10)
            // indiv_health[k].x = indiv_health[k].x - (init_width - indiv_health[k].width) / 2
        }
    }

    // FIGURE OUT WHICH OF THE 3 CARDS SHOULD NOW BE VISIBLE
    for (let k = 0; k < players.length; k++) {
        if (players[k].turn_end == true || players[k].blks_moved == players[k].speed) {
            indiv_covers[0][k].visible = true
            indiv_covers[1][k].visible = true
            indiv_covers[2][k].visible = true
        }
        else {
            indiv_covers[0][k].visible = false
            indiv_covers[1][k].visible = false
            indiv_covers[2][k].visible = false
        }
            
        if(indiv_cards[2][k].visible) {
            indiv_cards[2][k].visible = play_visible[k]
        }
        else {
            if(k == curr_player_index.item) {
                indiv_cards[0][k].visible = false
                indiv_cards[1][k].visible = play_visible[k]
            }
            else {
                indiv_cards[1][k].visible = false
                indiv_cards[0][k].visible = play_visible[k]
            }
        }
    }
    
    app.stage.removeChild(tot_cards.item[0])
    app.stage.addChild(tot_cards.item[0])
}