import { maze_dicter } from "../../vis_updated.mjs";
import { Astar_maze, dijkstra, heur_l2sqr } from "./path_finding.mjs";
import { find_sector } from "./path_finding_nodes.mjs";
import {game_map, game_maze, xrectnum, yrectnum, players, play_inds, curr_player, monsters, pause, menu_container, ptr, size, currx, curry, act_currx, act_curry, shiftx, shifty, chest_indices, chests, monster_indices, app, seen_indices} from "../../vis_updated.mjs";
import { blocked } from "../../methods/graphics/visibility.mjs";
import { dealDamage } from "../../methods/key_bind.mjs";

export const monster_state = Object.freeze({
    rest: 0,
    guard_patrol: 1,
    seek: 2,
    hunt: 3,
    fight: 4,
    return: 5
});

function deltaX(x1, y1, x2, y2)
{
    return [Math.abs(x1-x2), Math.abs(y1-y2)]
}

// using an L1 norm for ease
function distance(x1, y1, x2, y2) {
    return Math.abs(x1-x2) + Math.abs(y1-y2)
}

// need a function in_range
// returns if player is in range and if so, gives the distance it is away

export function monster_combat_range(center_x, center_y, numx, numy, tier, game_maze, range_type) {
    const off_cen_size = Math.max(1, 6 - tier)
    // console.log(off_cen_size)
    // We now use this to give our side indices
    let map_indices = []
    for (let y_off = -off_cen_size; y_off < off_cen_size + 1; y_off++) {
        if (center_y + y_off < 0 || center_y + y_off > numy - 1)
            continue
        if (!blocked(center_y * numx + center_x, center_x + numx*(center_y + y_off), numx, game_maze))
            continue;
        map_indices.push(center_x + numx*(center_y + y_off))
    }  
    for (let x_off = -off_cen_size; x_off < off_cen_size + 1; x_off++) {
        if (center_x + x_off < 0 || center_x + x_off > numx - 1)
            continue
        if (!blocked(center_y * numx + center_x, (center_x+x_off) + numx*(center_y), numx, game_maze))
            continue;
        map_indices.push((center_x+x_off) + numx*(center_y))
    }
    return map_indices
}

function follow_path(monster) {
    let next_ind = Math.min(monster.speed - 1, monster.cur_path.length - 1)
    let indices_to_travel = monster.cur_path.slice(0, next_ind + 1)

    
    let blocked_index = -1
    for (let l = 0; l < players.length; l++) {
        let test_ind = players[l].y * xrectnum + players[l].x
        let inside_list = indices_to_travel.indexOf(test_ind)
        if (inside_list != -1 && (inside_list < blocked_index || blocked_index == -1) )
            blocked_index = inside_list
    }
    for (let l = 0; l < monsters.length; l++) {
        let test_ind = monsters[l].y * xrectnum + monsters[l].x
        let inside_list = indices_to_travel.indexOf(test_ind)
        if (inside_list != -1 && (inside_list < blocked_index || blocked_index == -1) )
            blocked_index = inside_list
    }
    console.log("travel info")
    if (blocked_index != -1) {
        if (blocked_index != 0) {
            next_ind = blocked_index - 1
            let new_loc = monster.cur_path[next_ind]
            monster.x = new_loc % xrectnum
            monster.y = Math.floor(new_loc / xrectnum)
            monster.cur_path = monster.cur_path.slice(next_ind + 1)
        }
    }
    else {
        let new_loc = monster.cur_path[next_ind]
        monster.x = new_loc % xrectnum
        monster.y = Math.floor(new_loc / xrectnum)
        monster.cur_path = monster.cur_path.slice(next_ind + 1)
    }
    
}

function check_combat(monster) {
    const init_range_indices = monster_combat_range(monster.x, monster.y, xrectnum, yrectnum, monster.tier, game_maze, true)
    // console.log(init_range_indices)
    let in_range = false
    let closest_player_ind = 0
    let min_dist = 100
    for (let l = 0; l < players.length; l++) {
        if (players[l].health <= 0 || !seen_indices.item.includes(play_inds[l]))
            continue
        let player_ind = players[l].y * xrectnum + players[l].x
        let ind = init_range_indices.indexOf(player_ind)
        if (ind != -1) {
            let dist_away = distance(monster.x, monster.y, players[l].x, players[l].y)
            if (min_dist > dist_away) {
                min_dist = dist_away
                closest_player_ind = l
                in_range = true
            }
        }
    }
    if (!in_range){
        return [false]
    }
    else {
        return [in_range, closest_player_ind]
    }
}

export function hunt_brain(monster) {
    let mindist = 100
    let closest_player = 0
    for (let i = 0; i < players.length; i++) {
        if (players[i].health <= 0 || !seen_indices.item.includes(play_inds[i]))
            continue
        let xi = players[i].x 
        let yi = players[i].y
        let testdist = distance(xi, yi, monster.x, monster.y)
        if (mindist > testdist) {
            mindist = testdist
            closest_player = i
        }
    }
    // console.log(closest_player, mindist)
    if (monster.brain_count % 4 == 0 || monster.cur_path.length < 5) {
        monster.cur_path = Astar_maze(game_maze, xrectnum, yrectnum, monster.x, monster.y, players[closest_player].x, players[closest_player].y, heur_l2sqr)
        monster.cur_path = monster.cur_path.slice(1)
    }
    
    let do_combat = check_combat(monster)
    // console.log(do_combat)

    // attack 
    if (do_combat[0]) {
        monster.decision_state = monster_state.fight
        dealDamage(monster, players[do_combat[1]])
    }
    // seek and then attack
    else {
        monster.decision_state = monster_state.seek
        follow_path(monster)
        do_combat = check_combat(monster)
        if (do_combat[0]) {
            dealDamage(monster, players[do_combat[1]])
        }
    }


    monster.brain_count++
    
}

export function patrol_brain(monster) {
    // PSEUDO Code
    // create displacement array (using deltaX) and inRange array 
    // for players
        // add displacement and inrange if disp is small (if large, say false)
        // should get disp array as [[5,10],[3,2]..]
        // in range array as [False, [True, 3]...]
    // now create sector_displacement array 
        // gives element by element floor division by sector-size
        // then takes maximum of each position index to give number of sectors away
    
    // now check the last state
    let mindist = 100
    let closest_player = 0
    for (let i = 0; i < players.length; i++) {
        let xi = players[i].x 
        let yi = players[i].y
        let testdist = distance(xi, yi, monster.x, monster.y)
        if (mindist > testdist) {
            mindist = testdist
            closest_player = i
        }
    }
    let new_path = []
    if (mindist < 5) {
        new_path = Astar_maze(game_maze, xrectnum, yrectnum, monster.x, monster.y, players[closest_player].x, players[closest_player].y, heur_l2sqr)
    }
    let do_combat = check_combat(monster)


    if (monster.decision_state == monster_state.guard_patrol) {

    }
    else if (monster.decision_state == monster_state.seek) {

    }
    else if (monster.decision_state == monster_state.fight) {

    } 
    else if (monster.decision_state == monster_state.return) {

    }

    // attack
    if (do_combat[0]) {
        dealDamage(monster, players[do_combat[1]])
    }
    // seek and attack 
    else if(new_path.length < 10) {
        monster.cur_path = new_path.slice(1)


        let do_combat = check_combat(monster)
        if (do_combat[0]) {
            dealDamage(monster, players[do_combat[1]])
        }
    }
    

    monster.brain_count++
    // if rest, set counter value = counter - 1
        // if rest counter, go to top
}


// sector space is the rectangle of minimum and maximum x,y sectors
function ai(players){
    // design a flowchart for this stuff
        // start with simple AI and then proceed to more complex systems
    // these states can either be failed, successed, or running

    // some of these states are unlocked via tier, some are via an aggression stat
        // tuning aggression allows some states but also gets rid of some states

    // movement / combat may be dependent on monster characteristics
        // some are faster than others
        // some can occasionally go through wall
        // some can ignore walls altogether (by flying)
        // some can attack through walls
        // range differs for weapons / creatures (based on tiers & types)
        // some things also can use bombs or make walls
    
    // items monsters can carry
        // some tier 2 can carry weak weapons
        // some tier 4 and tier 5 can carry stronger weapons
    
    // AI states
        // rest
            // cooldown from other states, can't do anything
        // patrol / stay / guard
            // they move around randomly or on a set path 
            // (they are alert doing this)
        // seek
            // go towards enemy
        // hunt
            // found enemy and follow them (if far away use path_dict)
            // if close, use A* or by using a stupid AI that just goes in direction
        // fight
            // this will have multiple sub-elements
            // more complex fighting mechanics
                // some attack the weakest player
                // some attack the strongest player
                // some attack the first player they see
                // some stay out of range
                // some can move then attack then move again 
                    // complicated because have to do best possible move the first time

        // shield
            // some go into defensive state to minimize damage
            // maximize next attack
        // flee
            // run away
        // mob
            // they choose to find other monsters and join up together
            // may also choose leader
        // heal
            // some monsters can choose to heal when low on health

        // kamikaze
            // give enemies status effects if they die
            // if they choose to suicide, they get even stronger effects
        // prepare
            // they may plant bombs 
            // camouflage
            // create breakable walls
            // create monster spawning locations
            // change environment effects
        // command (allows for monsters to strategize without iterating over monster behavior)
            // command will have sub-elements
            // override monster self-commands (unless monster has extreme health / other concern)
                // if high health high aggression, ignore, if low health, low aggression ignore
            // make monster move to specific positions 
                // form walls separating players
                // choose to guard the high tier enemy
                // send kamikazes
                // set a trap
        // listen-to-order

    // if in sector space do AI stuff
        // some run away
        // some move randomly

    // if in sector + 1 space but not sector, then use path_dicts
        // some can fly 
        // some can wait in a spot for you to come that way
        // 
    // else just go towards the players 
        // some also herd together first
        // some herd around smaller monsters
        // some also go towards chests
        // some may also group into a trap
        // some also just go towards rooms
}