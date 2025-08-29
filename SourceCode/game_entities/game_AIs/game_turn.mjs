
import { monsters, monster_indices, monster_spawns, xrectnum, size, yrectnum, sect_size, game_map, play_inds, monster_spawn_indices } from "../../vis_updated.mjs"
import { Monster } from "../monster.mjs"
import { hunt_brain, hunt_flee_brain, patrol_brain, sniff_brain } from "./decisions.mjs"
import { adj_poses } from "../../methods/graphics/visibility.mjs"
import { spawn_mon } from "../others.mjs"


export function take_game_turn(){
    console.log("game_turn")
    // console.log(monsters[0].cur_path)
    // console.log(monsters[0].x, monsters[0].y)
    for (let k = 0; k < monsters.length; k++) {
        if (monsters[k].brain_type == "hunt") {
            hunt_brain(monsters[k])
        }
        else if (monsters[k].brain_type == "patrol") {
            patrol_brain(monsters[k])
        }
        else if (monsters[k].brain_type == "flee") {
            hunt_flee_brain(monsters[k])
        }
        else if(monsters[k].brain_type == "sniff") {
            sniff_brain(monsters[k])
        }
        else {
            console.log('unknown type')
        }
        console.log("_____", k)
        monster_indices[k] = monsters[k].y * xrectnum + monsters[k].x;
        console.log(monster_indices[k], monsters[k].decision_state)
    }
    for (let k = 0; k < monster_spawns.item.length; k++) {
        spawn_mon(monster_spawns.item[k])
    }
}
