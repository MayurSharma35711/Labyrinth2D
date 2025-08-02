import { Entities } from "./entity_classes.mjs";
import { find_sector } from "./game_AIs/path_finding_nodes.mjs";
import { game_maze, maze_dicter } from "../vis_updated.mjs";
import { Astar_maze } from "./game_AIs/path_finding.mjs";
import { monster_state } from "./game_AIs/decisions.mjs";
import { tot_height, tot_width } from "../vis_updated.mjs";

// shoudl have isOccupied condition for tile, so that if monsters or players are on tile, you can't move onto it
export class Monster extends Entities
{
    brain_type;
    constructor(tier, sizex, sizey, num_x, num_y, brain_type)
    { 
        super();
        super.setSpeed((6 - tier));
        super.setStrength(6 - tier);
        super.setRange(Math.floor(0.5 * (6 - tier)));
        super.setProt((6 - tier), (2 * (6 - tier)));
        super.setpos(Math.floor(Math.random() * num_x), Math.floor(Math.random() * num_y));
        super.setHealth((9 - tier) * 2);
        this.tier = tier
        this.brain_type = brain_type
        if (brain_type == "patrol") {
            this.decision_state = monster_state.guard_patrol
            this.init_sector = find_sector(maze_dicter[0], this.x, this.y, num_x, num_y)
            let adj_sectors = []
            for (let l = 0; l < maze_dicter[0].keys.length; l++) {
                // console.log(maze_dicter[0].keys[l])
                if (this.init_sector[0] == maze_dicter[0].keys[l][0] && ((this.init_sector[1] == maze_dicter[0].keys[l][1] - 1) || (this.init_sector[1] == maze_dicter[0].keys[l][1] + 1)))
                    adj_sectors.push(maze_dicter[0].keys[l])
                if (this.init_sector[1] == maze_dicter[0].keys[l][1] && ((this.init_sector[0] == maze_dicter[0].keys[l][0] - 1) || (this.init_sector[0] == maze_dicter[0].keys[l][0] + 1)))
                    adj_sectors.push(maze_dicter[0].keys[l])
            } 
            // console.log(adj_sectors)
            let best_dist_ind = 0 
            let best_dist = 100
            let best_path = []
            for (let k = 0; k < adj_sectors.length; k++) {
                let pather = maze_dicter[1].getElt([this.init_sector, adj_sectors[k]])
                if (pather == false) 
                    pather = maze_dicter[1].getElt([adj_sectors[k], this.init_sector])
                if (best_dist > pather.length) {
                    best_dist = pather.length
                    best_dist_ind = k
                    best_path = pather
                }
            }

            this.final_sector = adj_sectors[best_dist_ind]
            this.patrol_path = best_path
            this.orientation = 0
            this.cur_path = []
            this.brain_count = 0

        }
        if (brain_type == "hunt") {
            this.state_type = monster_state.seek
            this.init_sector = find_sector(maze_dicter[0], this.x, this.y, num_x, num_y)
            this.cur_path = []
            this.final_sector = false
            this.patrol_path = false
            this.orientation = 0
            this.brain_count = 0
        }
        switch(tier)
        {
        case 1:
            this.color = 0xBB1F71
            // // alert(color);
            break;
        case 2:
            this.color = 0x00BBFF
            // // alert("2");
            // // alert(color);
            break;
        case 3:
            this.color = 0x00FF77
            // // alert(3)
            // // alert(color);
            break;
        case 4:
            this.color = 0x6011FF
            // // alert(4)
            // // alert(color)
            break;
        case 5:
            this.color = 0xFFCC00
            // // alert(6);
            // // alert(color)
            break;
        default:
            // // alert("BAD");
            break;
        }
        // // alert(color);
        // // alert("Here");
        super.printPos();
        // super.drawMe(cell_sizex/tier, cell_sizey/tier, color, cell_sizex, cell_sizey);
        // // alert("Out");
        // this.x = indx
        // this.y = indy
        this.rect = new PIXI.Graphics();
        this.rect.rect(0, 0, sizex/2, sizey/2);
        this.rect.fill(this.color);
        // this.drawMe(cell_sizex, cell_sizey, 0, 0)
    }
    drawMe (sizex,sizey, currx, curry) {
        // this.spr.x = (this.x - relx)
        this.rect.width = sizex / 2
        this.rect.height = sizey / 2
        this.rect.x = (this.x - currx + 0.25) * sizex + Math.floor(tot_width / 2)
        this.rect.y = (this.y - curry + 0.25) * sizey + Math.floor(tot_height / 2)
    }
    resize (sizex, sizey) {
        this.rect.width = sizex / 2
        this.rect.height = sizey / 2
    }
}