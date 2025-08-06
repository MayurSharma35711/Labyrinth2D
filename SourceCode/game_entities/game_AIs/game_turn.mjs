
import { monsters, monster_indices, xrectnum } from "../../vis_updated.mjs"
import { hunt_brain, hunt_flee_brain, patrol_brain, sniff_brain } from "./decisions.mjs"

export function take_game_turn(){
    // console.log("game_turn")
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
        monster_indices[k] = monsters[k].y * xrectnum + monsters[k].x;
        // console.log(monster_indices[k])
    }
}
