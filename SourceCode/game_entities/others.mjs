import { Entities } from "./entity_classes.mjs";
import { inventory, size, tot_height, cutoff_y, tot_width } from "../vis_updated.mjs";
import { make_selector } from "../methods/displays/pop_up.mjs";
import { monsters, monster_indices, app, pause, selector, selector_bubble, monster_spawns, xrectnum, yrectnum, sect_size, game_map, play_inds, monster_spawn_indices } from "../vis_updated.mjs"
import { Monster } from "./monster.mjs"
import { hunt_brain, hunt_flee_brain, patrol_brain, sniff_brain } from "./game_AIs/decisions.mjs"
import { adj_poses } from "../methods/graphics/visibility.mjs"
import { blocked } from "../methods/graphics/visibility.mjs";

await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/sprites/monster_spawner_beta.png');

export class Other extends Entities
{
    constructor(sizex, sizey, label, type) {
        super()
        this.type = type
        this.label = label
        super.setHealth(3); 
        super.setSpeed(0);
    }
}

export class MonsterSpawner extends Entities {
    constructor(tier, sizex, sizey, num_x, num_y, map, label, type, freq) {
        super()
        this.sprite = PIXI.Sprite.from('https://mayursharma35711.github.io/Labyrinth2D/textures/sprites/monster_spawner_beta.png');
        this.sprite.width = sizex * 3 / 4
        this.sprite.height = sizey * 3 / 4
        let x = Math.floor(Math.random() * num_x)
        let y = Math.floor(Math.random() * num_y)
        let ind = x + num_x * y
        while(map[ind].getBiome() == 9 || map[ind].getBiome() == -1 || map[ind].getBiome() == 10) {
            x = Math.floor(Math.random() * num_x)
            y = Math.floor(Math.random() * num_y)
            ind = x + num_x * y
        }
        super.setpos(x, y);
        this.tier = tier
        this.type = type
        this.label = label
        this.turnval = 0
        this.freq = freq
        this.health = 10
        this.display = false
    }
    drawMe(sizex, sizey, currx, curry){
        this.sprite.x = (this.x - currx + 1 / 8) * sizex + Math.floor(tot_width.item / 2)
        this.sprite.y = (this.y - curry + 1 / 8) * sizey + Math.floor(tot_height.item / 2 - cutoff_y.item / 2)

        this.sprite.interactive = true;
        this.sprite.buttonMode = true; // Changes cursor on hover
                
                
        
        this.sprite.on('pointerdown', () => {
            if (!pause.item && !inventory.item && this.display) {
				app.stage.removeChild(selector_bubble.item)
                this.display = false
                selector.item = false
			}
            else if (!pause.item && !inventory.item) {
                console.log("here")
                // if (selector.item) {
                app.stage.removeChild(selector_bubble.item)
                // }
                this.display = true

                let bubblex = this.sprite.x 
                let bubbley = this.sprite.y
                let cellx = this.sprite.x + this.sprite.width * 1/8
                let celly = this.sprite.y + this.sprite.width * 1/8
                let cell_width = this.sprite.width
                let cell_height = this.sprite.height
                let str2print = this.label + "; " + this.type + "; " + this.freq.toString()
                
                selector_bubble.item = make_selector(bubblex, bubbley, 100, 50, str2print, 0x20BBAA, 0xAA00AA, cellx, celly, cell_width * 3 / 4, cell_height * 3 / 4)
                // console.log(this.sprite.x + app.screen.width / 2, this.sprite.y + app.screen.height / 2)
                app.stage.addChild(selector_bubble.item)
                // console.log('selector case!', selector.item);
            }
            // Add logic to start game or transition to another scene
        });
    }
    resize(sizex, sizey) {
        this.sprite.width = sizex * 3 / 4
        this.sprite.height = sizey * 3 / 4
    }
}

export function spawn_mon(monster_spawn) {
    monster_spawn.turnval++
    if (monster_spawn.turnval % monster_spawn.freq == 0) {
        // let nbrs = adj_poses(monster_spawn.x, monster_spawn.y, xrectnum, yrectnum)
        // let nbr_inds = new Array(nbrs.length)
        // for (let l = 0; l < nbrs.length; l++) {
        //     nbr_inds[l] = nbrs[l][0] + nbrs[l][1] * xrectnum
        // }
        // if (!(nbrs.includes(play_inds, )))
        // let blocked_case = true
        // let l
        // // for (l = 0; l < nbr_inds.length; l++) {
        //     if (play_inds.includes(nbr_inds[l]))
        //         continue
        //     if (monster_indices.includes(nbr_inds[l]))
        //         continue
        //     if (monster_spawn_indices.includes(nbr_inds[l]))
        //         continue
        //     blocked_case = false
            // break
        // }
        let blocked_case = false
        let myind = monster_spawn.x + monster_spawn.y * xrectnum
        if (play_inds.includes(myind))
            blocked_case = true
        if (monster_indices.includes(myind))
            blocked_case = true

        if (!blocked_case) {
            let x = monster_spawn.x
            let y = monster_spawn.y
            // console.log(nbr_inds)
            let tier = monster_spawn.tier
            let sizer = size.item
            let brain = monster_spawn.type
            monsters.push( new Monster(tier, sizer, sizer, xrectnum, yrectnum, brain, game_map.item, sect_size, x, y) )
            monster_indices.push(x + y * xrectnum)
        }
        console.log(monsters[monsters.length - 1])
    }
}