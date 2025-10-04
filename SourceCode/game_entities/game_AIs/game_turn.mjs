
import { players, monsters, monster_indices, monster_spawns, xrectnum, size, yrectnum, sect_size, game_map, play_inds, monster_spawn_indices, seen_indices } from "../../vis_updated.mjs"
import { Monster } from "../monster.mjs"
import { hunt_brain, hunt_flee_brain, patrol_brain, sniff_brain } from "./decisions.mjs"
import { adj_poses } from "../../methods/graphics/visibility.mjs"
import { spawn_mon } from "../others.mjs"


export function take_game_turn(){
    console.log("game_turn-------------------------------------------")
    // console.log(monsters[0].cur_path)
    // console.log(monsters[0].x, monsters[0].y)

    // here the environment has to act
        // any map_obstruction that is on screen has to take a turn
    let entities = monsters.item.concat(players)
    for (let i = 0; i < entities.item.length; i++) {
        let ind = entities.item[i].x + entities.item[i].y * xrectnum
        if (seen_indices.item.includes(ind)) {
            // do something
        }
    }

    // any on_screen tile with a monster or player also has to take a turn
    for (let k = 0; k < monsters.item.length; k++) {
        if (monsters.item[k].brain_type == "hunt") {
            hunt_brain(monsters.item[k])
        }
        else if (monsters.item[k].brain_type == "patrol") {
            patrol_brain(monsters.item[k])
        }
        else if (monsters.item[k].brain_type == "flee") {
            hunt_flee_brain(monsters.item[k])
        }
        else if(monsters.item[k].brain_type == "sniff") {
            sniff_brain(monsters.item[k])
        }
        else {
            console.log('unknown type')
        }
        // console.log("_____", k)
        monster_indices.item[k] = monsters.item[k].y * xrectnum + monsters.item[k].x;
        // console.log(monster_indices.item[k], monsters.item[k].decision_state)
    }
    for (let k = 0; k < monster_spawns.item.length; k++) {
        spawn_mon(monster_spawns.item[k])
    }
}
