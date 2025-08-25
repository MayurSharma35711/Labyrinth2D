import { Entities } from "./entity_classes.mjs";
import { find_sector, get_sector_indices } from "./game_AIs/path_finding_nodes.mjs";
import { game_maze, maze_dicter, xrectnum, app, inventory } from "../vis_updated.mjs";
import { Astar_maze, heur_l2sqr } from "./game_AIs/path_finding.mjs";
import { monster_state } from "./game_AIs/decisions.mjs";
import { tot_height, tot_width, cutoff_y } from "../vis_updated.mjs";
import { print_walls } from "../bkgnd_objs/mazegen.mjs";
import { print_state } from "./game_AIs/decisions.mjs";
import { pause, selector, selector_bubble } from "../vis_updated.mjs";
import { make_selector } from "../methods/displays/pop_up.mjs";

// shoudl have isOccupied condition for tile, so that if monsters or players are on tile, you can't move onto it
export class Monster extends Entities
{
    brain_type;
    constructor(tier, sizex, sizey, num_x, num_y, brain_type, map, sector_size, x, y)
    { 
        super();
        super.setSpeed((6 - tier));
        super.setStrength(6 - tier);
        super.setRange(Math.floor(0.5 * (6 - tier)));
        super.setProt((6 - tier), (2 * (6 - tier)));
        super.setpos(x, y);
        super.setHealth((9 - tier) * 2);
        this.tier = tier
        this.brain_type = brain_type
        this.display = false
        if (brain_type == "patrol") {
            this.decision_state = monster_state.return
            this.init_sector = find_sector(maze_dicter[0], this.x, this.y, num_x, num_y)
            let adj_sectors = []
            for (let l = 0; l < maze_dicter[0].keys.length; l++) {
                // console.log(maze_dicter[0].keys[l])
                let sector_new = get_sector_indices(num_x, num_y, sector_size, maze_dicter[0].keys[l][0],maze_dicter[0].keys[l][1])
                let new_center = sector_new[~~(sector_new.length / 2)]
                // console.log(sector_new)
                if(map[new_center].getBiome() == 9 || map[new_center].getBiome() == 10) {
                    // console.log("here")
                    continue
                }
                else if (this.init_sector[0] == maze_dicter[0].keys[l][0] && ((this.init_sector[1] == maze_dicter[0].keys[l][1] - 1) || (this.init_sector[1] == maze_dicter[0].keys[l][1] + 1))) 
                    adj_sectors.push(maze_dicter[0].keys[l])
                else if (this.init_sector[1] == maze_dicter[0].keys[l][1] && ((this.init_sector[0] == maze_dicter[0].keys[l][0] - 1) || (this.init_sector[0] == maze_dicter[0].keys[l][0] + 1)))
                    adj_sectors.push(maze_dicter[0].keys[l])
            } 
            // console.log(this.init_sector, adj_sectors)
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
            // print_walls(game_maze, num_x, num_y)
            // console.log(map[this.x + this.y * num_x].getBiome())
            // console.log(this.x, this.y, this.patrol_path[0] % num_x, Math.floor(this.patrol_path[0] / num_x))
            // console.log(Astar_maze(game_maze, num_x, num_y, this.x, this.y, this.patrol_path[0] % num_x, Math.floor(this.patrol_path[0] / num_x), heur_l2sqr, map))
            this.cur_path = Astar_maze(game_maze, num_x, num_y, this.x, this.y, this.patrol_path[0] % num_x, Math.floor(this.patrol_path[0] / num_x), heur_l2sqr, map, []).slice(1)
            this.brain_count = 0
            this.lastpos = [best_path[0] % num_x, Math.floor(best_path[0] / num_x)]

        }
        if (brain_type == "hunt") {
            this.decision_state = monster_state.seek
            this.init_sector = find_sector(maze_dicter[0], this.x, this.y, num_x, num_y)
            let new_path = Astar_maze(game_maze, num_x, num_y, this.x, this.y, 0,0,heur_l2sqr, map, [])
            if (new_path != false)
                this.cur_path = new_path.slice(1)
            this.final_sector = false
            this.patrol_path = false
            this.orientation = 0
            this.brain_count = 0
        }
        if (brain_type == "flee") {
            this.decision_state = monster_state.seek
            this.init_sector = find_sector(maze_dicter[0], this.x, this.y, num_x, num_y)
            this.cur_path = []
            this.final_sector = false
            this.patrol_path = false
            this.orientation = 0
            this.brain_count = 0
        }
        if (brain_type == "sniff") {
            this.decision_state = monster_state.sniff
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
            this.color = 0xAA00FF
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
        this.rect.x = (this.x - currx + 0.25) * sizex + Math.floor(tot_width.item / 2)
        this.rect.y = (this.y - curry + 0.25) * sizey + Math.floor(tot_height.item / 2 - cutoff_y.item / 2) 


        this.rect.interactive = true;
        this.rect.buttonMode = true;
        this.rect.on('pointerdown', () => {
            if (!pause.item && !inventory.item && this.display) {
				app.stage.removeChild(selector_bubble.item)
                this.display = false
                selector.item = false
			}
            else if (!pause.item && !inventory.item) {
                console.log("here")
                // if (selector.item) {
                app.stage.removeChild(selector_bubble.item)
                this.display = true
                // }

                let bubblex = this.rect.x 
                let bubbley = this.rect.y
                let cellx = this.rect.x - this.rect.width * 1/4
                let celly = this.rect.y - this.rect.width * 1/4
                let cell_width = 2 * this.rect.width
                let cell_height = 2 * this.rect.height
                let str2print = this.tier + "; " + this.brain_type
                
                selector_bubble.item = make_selector(bubblex, bubbley, 100, 50, str2print, 0x2088AA, 0xAA0000, cellx, celly, cell_width * 3 / 4, cell_height * 3 / 4)
                // console.log(this.sprite.x + app.screen.width / 2, this.sprite.y + app.screen.height / 2)
                app.stage.addChild(selector_bubble.item)
                // console.log('selector case!', selector.item);
            }
            // Add logic to start game or transition to another scene
        });
    }
    resize (sizex, sizey) {
        this.rect.width = sizex / 2
        this.rect.height = sizey / 2
    }
}