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
    return: 5, 
    flee: 6,
    sniff: 7
});

export function print_state(monster){
    let str = ""
    if (monster.decision_state == 0)
        str = "rest"
    else if (monster.decision_state == 1)
        str = "patrol"
    else if (monster.decision_state == 2)
        str = "seek"
    else if (monster.decision_state == 3)
        str = "hunt"
    else if (monster.decision_state == 4)
        str = "fight"
    else if (monster.decision_state == 5)
        str = "return"
    return str
}

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
    const off_cen_size = Math.max(1, 7 - tier)
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
    // console.log("travel info")
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


// This function doesn't work at all ;,()
function dir_blocked(monster, shiftx, shifty){
    let initx = monster.x
    let inity = monster.y
    let init_ind = initx + inity * xrectnum
    if (shiftx == 1) {
        return game_maze.item[2 * init_ind + 1].getWall()
    }
    if (shiftx == -1) {
        return game_maze.item[2 * init_ind - 1].getWall()
    }
    if (shifty == 1) {
        return game_maze.item[2 * init_ind].getWall()
    }
    if (shifty == -1) {
        return game_maze.item[2 * init_ind - 2*xrectnum].getWall()
    }
    return false
}

function go_direction(monster, direction) {
    let shiftx = 0 
    let shifty = 0
    if (direction == 0) // right case
    {
        shiftx = 1
    }
    else if (direction == 1) // left case
    {
        shiftx = -1 
    }
    else if (direction == 2) // up case 
    {
        shifty = 1
    }
    else if (direction == 3) // down case
    {
        shifty = -1 
    }

    if (monster.y + shifty < 0 || monster.y + shifty > yrectnum - 1)
        return false
    if (monster.x + shiftx < 0 || monster.x + shiftx > xrectnum - 1)
        return false
    // console.log(shiftx, shifty)
    if (dir_blocked(monster, shiftx, shifty)){
        // console.log("here")
        return false
    }
    // console.log("wall checked")

    for (let l = 0; l < players.length; l++) {
        let test_ind = players[l].y * xrectnum + players[l].x
        if (test_ind == (monster.y + shifty) * xrectnum + (monster.x + shiftx))
            return false
    }
    for (let l = 0; l < monsters.length; l++) {
        let test_ind = monsters[l].y * xrectnum + monsters[l].x
        if (test_ind == (monster.y + shifty) * xrectnum + (monster.x + shiftx))
            return false
    }

    monster.x = monster.x + shiftx
    monster.y = monster.y + shifty
    return true
}

function get_ordering(xdist, ydist) { // designed to flee, to go towards, put in negative directions
    let xcaser = 0
    let ycaser = 2
    if (xdist < 0)
        xcaser = 1
    if (ydist < 0)
        ycaser = 3

    if (xdist == 0) {
        xcaser = Math.floor(2* Math.random())
    }
    if (ydist == 0) {
        ycaser = Math.floor(2* Math.random()) + 2
    }
    if (Math.abs(xdist) > Math.abs(ydist)) {
        return [xcaser, ycaser]
    }
    return [ycaser, xcaser]

}


function check_combat(monster) {
    const init_range_indices = monster_combat_range(monster.x, monster.y, xrectnum, yrectnum, monster.tier, game_maze.item, true)
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
    let best_path = []
    let closest_player = 0
    // console.log("hereerere")
    // console.log(monster.cur_path)
    // for (let i = 0; i < players.length; i++) {
    //     if (players[i].health <= 0 || !seen_indices.item.includes(play_inds[i]))
    //         continue
    //     let xi = players[i].x 
    //     let yi = players[i].y
    //     if (game_map[yi * xrectnum + xi].getBiome() == 9 || game_map[yi * xrectnum + xi].getBiome() == 10)
    //         continue
    //     let testdist = distance(xi, yi, monster.x, monster.y)
    //     if (mindist > testdist) {
    //         mindist = testdist
            
    //     }
    // }

    // closest_player = i
    
    console.log(print_state(monster))
    if (monster.brain_count % 4 == 0 || monster.cur_path.length < 5) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].health <= 0 || !seen_indices.item.includes(play_inds[i]))
                continue
            let entities = [];
            // entities = entities.concat(monsters);
            entities = entities.concat(players);
            // console.log(entities, players)
            console.log("player", i)
            let test_new_path = Astar_maze(game_maze.item, xrectnum, yrectnum, monster.x, monster.y, players[i].x, players[i].y, dijkstra, game_map.item, players)
            console.log(test_new_path)
            // console.log(Astar_maze(game_maze, xrectnum, yrectnum, monster.x, monster.y, players[i].x, players[i].y, dijkstra, game_map, entities))
            if (test_new_path == false)
                continue
            
            if (test_new_path.length < mindist) {
                // console.log(i, best_path)
                best_path = test_new_path
                closest_player = i
                mindist = test_new_path.length
            }
        }
        // console.log("hererere")
        
        console.log(best_path)
        if (best_path.length == 0)
            monster.decision_state = monster_state.rest
        else 
            monster.cur_path = best_path.slice(1)
        
            
    }
    // console.log(print_state(monster))
    
    let do_combat = check_combat(monster)
    // console.log("hi there")

    // attack 
    if (do_combat[0]) {
        monster.decision_state = monster_state.fight
        dealDamage(monster, players[do_combat[1]])
    }
    // print_state(monster)
    // console.log(monster)
    if (monster.decision_state == monster_state.fight) {
        // not in range, so start seeking
        if(!do_combat[0]) {
            monster.decision_state = monster_state.seek
        }
    }
    // seek and then attack
    if(monster.decision_state == monster_state.seek) {
        follow_path(monster)

        do_combat = check_combat(monster)
        if (do_combat[0]) {
            dealDamage(monster, players[do_combat[1]])
            monster.decision_state = monster_state.fight
        }
    }
    if(monster.decision_state == monster_state.rest) {
        let entities = [];
        // entities = entities.concat(monsters);
        entities = entities.concat(players);
        // console.log(entities, players)
        console.log("came to do a rest")
        let test_new_path = Astar_maze(game_maze.item, xrectnum, yrectnum, monster.x, monster.y, players[closest_player].x, players[closest_player].y, dijkstra, game_map.item, entities)
        // console.log(test_new_path)
        if(test_new_path != false && test_new_path.length > 0) {
            monster.decision_state = monster_state.seek
            monster.cur_path = test_new_path.slice(1)
        }
    }


    monster.brain_count++
    
}


export function hunt_flee_brain(monster) {
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
        let test_new_path = Astar_maze(game_maze.item, xrectnum, yrectnum, monster.x, monster.y, players[closest_player].x, players[closest_player].y, dijkstra, game_map.item)
        if (test_new_path != false && test_new_path.length > 0)
            monster.cur_path = test_new_path.slice(1)
        else
            monster.decision_state = monster_state.rest
    }
    
    let do_combat = check_combat(monster)
    // console.log("hi there")

    // attack 
    if (do_combat[0] && monster.health > 3) {
        monster.decision_state = monster_state.fight
        dealDamage(monster, players[do_combat[1]])
    }
    
    if (monster.decision_state == monster_state.fight) {
        // not in range, so start seeking
        if(!do_combat[0]) {
            monster.decision_state = monster_state.seek
        }
        if (monster.health < 4) {
            monster.decision_state = monster_state.flee
        }
    }
    // seek and then attack
    if(monster.decision_state == monster_state.seek) {
        // console.log(monster.cur_path)
        if (monster.health < 4) {
            monster.decision_state = monster_state.flee
        }
        else {
            follow_path(monster)
    
            do_combat = check_combat(monster)
            if (do_combat[0]) {
                dealDamage(monster, players[do_combat[1]])
                monster.decision_state = monster_state.fight
            }
        }
    }
    if (monster.decision_state == monster_state.flee) {
        let count = 0
        while (count < monster.speed) {
            const x_dist = monster.x - players[closest_player].x
            const y_dist = monster.y - players[closest_player].y
            let order = get_ordering(x_dist, y_dist)
            let l
            for (l = 0; l < order.length; l++) {
                let teststep = go_direction(monster, order[l])
                if (teststep) {
                    count++
                    break
                }
            }
            if (l == order.length)
                break
        }
        
        
    }

    if(monster.decision_state == monster_state.rest) {
        let test_new_path = Astar_maze(game_maze.item, xrectnum, yrectnum, monster.x, monster.y, players[closest_player].x, players[closest_player].y, dijkstra, game_map.item)
        console.log(test_new_path)
        if(test_new_path != false && test_new_path.length > 0) {
            monster.decision_state = monster_state.seek
            monster.cur_path = test_new_path.slice(1)
        }
    }

    monster.brain_count++
    
}


export function sniff_brain(monster) {
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
    // if (monster.brain_count % 4 == 0 || monster.cur_path.length < 5) {
    //     let test_new_path = Astar_maze(game_maze, xrectnum, yrectnum, monster.x, monster.y, players[closest_player].x, players[closest_player].y, dijkstra, game_map)
    //     if (test_new_path != false && test_new_path.length > 0)
    //         monster.cur_path = test_new_path.slice(1)
    // }
    
    let do_combat = check_combat(monster)
    // console.log("hi there")

    // attack 
    if (do_combat[0] && monster.health > 3) {
        monster.decision_state = monster_state.fight
        dealDamage(monster, players[do_combat[1]])
    }
    
    if (monster.decision_state == monster_state.fight) {
        // not in range, so start seeking
        if(!do_combat[0]) {
            monster.decision_state = monster_state.sniff
        }
        if (monster.health < 4) {
            monster.decision_state = monster_state.flee
        }
    }
    if (monster.decision_state == monster_state.sniff) {
        let count = 0
        while (count < monster.speed) {
            const x_dist = -(monster.x - players[closest_player].x)
            const y_dist = -(monster.y - players[closest_player].y)
            let order = get_ordering(x_dist, y_dist)
            let l
            for (l = 0; l < order.length; l++) {
                let teststep = go_direction(monster, order[l])
                if (teststep) {
                    count++
                    break
                }
            }
            if (l == order.length)
                break
        }
        
        
    }


    monster.brain_count++
    
}

export function patrol_brain(monster) {
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
    let new_path = Astar_maze(game_maze.item, xrectnum, yrectnum, monster.x, monster.y, players[closest_player].x, players[closest_player].y, dijkstra, game_map.item)
    // console.log("repath")
    // console.log(new_path)
    if (new_path != false && new_path.length > 0)
        new_path = new_path.slice(1)

    
    let do_combat = check_combat(monster)

    // print_state(monster)
    // console.log(monster.x, monster.y)
    // fight immediately against nearest player
    if (do_combat[0]) {
        monster.decision_state = monster_state.fight
        dealDamage(monster, players[do_combat[1]])
    }

    if (monster.decision_state == monster_state.fight) {
        // player not in range
        console.log("case 1")
        console.log(monster.x, monster.y)
        if (!do_combat[0]) {
            // reseeking case
            if (new_path.length < 4) {
                monster.cur_path = new_path
                monster.decision_state = monster_state.seek
            // repatrolling case
            } else if (monster.patrol_path.includes(monster.y * xrectnum + monster.x)) {
                monster.decision_state = monster_state.guard_patrol
            // returning case
            } else {
                let test_new_path= Astar_maze(game_maze, xrectnum, yrectnum, monster.x, monster.y, monster.lastpos[0], monster.lastpos[1], dijkstra, game_map.item)
                if (test_new_path != false && test_new_path.length > 0)
                    monster.cur_path = test_new_path.slice(1)
                monster.decision_state = monster_state.return
            }
        }
    }

    // do patrol 
    if (monster.decision_state == monster_state.guard_patrol) {
        // go out and seek the monster
        // console.log("case 2")
        // console.log(monster.x + xrectnum * monster.y, monster.cur_path)
        // console.log('orientation')
        // console.log(monster.orientation)
        if (new_path.length < 7) {
            monster.cur_path = new_path
            monster.lastpos = [monster.x, monster.y]
            monster.decision_state = monster_state.seek
            // follow_path(monster)
            // do_combat = check_combat(monster)
            // if (do_combat[0]) { 
            //     dealDamage(monster, players[do_combat[1]])
            //     monster.decision_state = monster_state.fight
            // }
        }
        // just continue doing patrol
        else {
            follow_path(monster)
            // monster.last_brain_check = monster.brain_count

            do_combat = check_combat(monster)
            if (do_combat[0]) {
                monster.decision_state = monster_state.fight
                dealDamage(monster, players[do_combat[1]])
            }

            if (monster.cur_path.length < 1) {
                monster.orientation = (monster.orientation + 1) % 2
                if (monster.orientation == 0) {
                    monster.cur_path = monster.patrol_path.slice(1)
                    // console.log("nonrev")
                    // console.log(monster.patrol_path)
                }
                else {
                    monster.cur_path = monster.patrol_path.toReversed().slice(1)
                    // console.log("rev")
                    // console.log(monster.patrol_path.toReversed())
                }
                    
                // console.log(monster.cur_path, monster.orientation)
            }
        }
    }
    // seek out FINISH THIS CASE
    if (monster.decision_state == monster_state.seek) {
        // seeking out the monster
        // console.log("case 3")
        // console.log(monster.x, monster.y)
        if(new_path.length < 7) {
            follow_path(monster)
            do_combat = check_combat(monster)
            if (do_combat[0]) { 
                dealDamage(monster, players[do_combat[1]])
                monster.decision_state = monster_state.fight
            }
        }
        // returning to the last spot
        else {
            new_path = Astar_maze(game_maze.item, xrectnum, yrectnum, monster.x, monster.y, monster.lastpos[0], monster.lastpos[1], dijkstra, game_map.item)
            monster.decision_state = monster_state.return
            if(new_path != false && test_new_path != false && test_new_path.length > 0) {
                monster.cur_path = new_path
                follow_path(monster)
            }

            do_combat = check_combat(monster)
            if (do_combat[0]) { 
                dealDamage(monster, players[do_combat[1]])
                monster.decision_state = monster_state.fight
            }
        }
    }
    if (monster.decision_state == monster_state.return) {
        // now there is a player nearby so start seeking 
        if(new_path.length < 4) {
            monster.cur_path = new_path
            follow_path(monster)
            monster.decision_state = monster_state.seek

            do_combat = check_combat(monster)
            if (do_combat[0]) {
                monster.decision_state = monster_state.fight
                dealDamage(monster, players[do_combat[1]])
            }
        }
        // return and then check if you're on the patrol path or not (and then do damage)
        else {
            follow_path(monster)
            // console.log(monster.x + xrectnum * monster.y, monster.cur_path)
            // console.log("now returning")
            let inder = monster.patrol_path.indexOf(monster.y * xrectnum + monster.x)          
            if(inder != -1) {
                monster.decision_state = monster_state.guard_patrol
                
                if (monster.orientation == 0) {
                    monster.cur_path = monster.patrol_path.slice(inder + 1)
                }
                else {
                    monster.cur_path = monster.patrol_path.slice(0, inder - 1).toReversed()
                }
                
            }

            do_combat = check_combat(monster)
            if (do_combat[0]) {
                monster.decision_state = monster_state.fight
                dealDamage(monster, players[do_combat[1]])
            }
        }
    }

    // console.log("case 1")
    // console.log(monster.x, monster.y)
    monster.brain_count++

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