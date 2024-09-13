const state = Object.freeze({
    rest: 0,
    guard_patrol: 1,
    seek: 2,
    hunt: 3,
    fight: 4
});

function deltaX(x1, y1, x2, y2)
{
    return [Math.abs(x1-x2), Math.abs(y1-y2)]
}

// need a function in_range
// returns if player is in range and if so, gives the distance it is away

function simple_brain(players, monster) {
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

    // if dist > sector + 1 space
        // seek
    // if sector space < dist < sector + 1 space
        // hunt or patrol
    // if in range
        // fight
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