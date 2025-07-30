
class D_Tree{
    node_leaf;
    child_leaves;
    constructor(node_leaf, child_leaves){
        this.node_leaf = node_leaf
        this.child_leaves = child_leaves
    }
    get_level(level){
        // this will never get called for something with depth greater than 5, 
        // so I just hard coded it bc the API func doesn't work
        if (level == 0){
            return [this]
        }
        if (level == 1){
            return this.child_leaves
        }
        if (this.child_leaves == []){
            return 0
        }

        return this.child_leaves[0].get_level(level-1).concat(this.child_leaves[1].get_level(level-1))
        
        
        // full_kids.flat(Infinity)

        return full_kids
    }
}


function cut_room(room_tree){
    let cut_choice = Math.random();
    let room1 = room_tree.node_leaf
    let new_room1
    let new_room2
    if (cut_choice > 0.5){ // horizontal cut made
        let cutloc = Math.floor(Math.random() * room1.size_y / 2 + room1.size_y / 4)
        new_room1 = new D_Room(room1.size_x, cutloc, room1.start_x, room1.start_y)
        new_room2 = new D_Room(room1.size_x, room1.size_y - cutloc , room1.start_x, room1.start_y + cutloc)
    } else { // vertical cut made
        let cutloc = Math.floor(Math.random() * room1.size_x / 2 + room1.size_x / 4)
        new_room1 = new D_Room(cutloc, room1.size_y, room1.start_x, room1.start_y)
        new_room2 = new D_Room(room1.size_x - cutloc, room1.size_y , room1.start_x  + cutloc, room1.start_y)
    }
    let new_tree1 = new D_Tree(new_room1, [])
    let new_tree2 = new D_Tree(new_room2, [])
    // let better_tree = new D_Tree(room1, [new_tree1, new_tree2])
    room_tree.child_leaves = [new_tree1, new_tree2]
    // return better_tree
}

function find_adjacent_tree_room(rooms, room_ind) {
    let x_i = rooms[room_ind].start_x
    let y_i = rooms[room_ind].start_y
    let x_f = x_i + rooms[room_ind].size_x
    let y_f = y_i + rooms[room_ind].size_y

    let adjacent_room = []
    // console.log(room_ind)
    for (let k = 0; k < rooms.length; k++) {
        if (k == room_ind)
            continue
        let comp_x_i = rooms[k].start_x
        let comp_y_i = rooms[k].start_y
        let comp_x_f = comp_x_i + rooms[k].size_x
        let comp_y_f = comp_y_i + rooms[k].size_y
        // console.log("------")
        // console.log(comp_x_i)
        // console.log(comp_x_f)
        // console.log(comp_y_i)
        // console.log(comp_y_f)
        if (comp_x_i == x_f && ((comp_y_i >= y_i && comp_y_i <= y_f) || (comp_y_f >= y_i && comp_y_f <= y_f)))
            adjacent_room.push(k)
        else if (comp_x_f == x_i && ((comp_y_i >= y_i && comp_y_i <= y_f) || (comp_y_f >= y_i && comp_y_f <= y_f)))
            adjacent_room.push(k)
        else if (comp_y_i == y_f && ((comp_x_i >= x_i && comp_x_i <= x_f) || (comp_x_f >= x_i && comp_x_f <= x_f)))
            adjacent_room.push(k)
        else if (comp_y_f == y_i && ((comp_x_i >= x_i && comp_x_i <= x_f) || (comp_x_f >= x_i && comp_x_f <= x_f)))
            adjacent_room.push(k)
    }
    return adjacent_room
}

function is_adjacent_tree_room(tree_room1, tree_room2) {
    let x_i = tree_room1.start_x
    let y_i = tree_room1.start_y
    let x_f = x_i + tree_room1.size_x
    let y_f = y_i + tree_room1.size_y

    // let adjacent_room = []
    
    let comp_x_i = tree_room2.start_x
    let comp_y_i = tree_room2.start_y
    let comp_x_f = comp_x_i + tree_room2.size_x
    let comp_y_f = comp_y_i + tree_room2.size_y
    if (comp_x_i == x_f && ((comp_y_i > y_i && comp_y_i < y_f) || (comp_y_f > y_i && comp_y_f < y_f)))
        return true
    else if (comp_x_f == x_i && ((comp_y_i > y_i && comp_y_i < y_f) || (comp_y_f > y_i && comp_y_f < y_f)))
        return true
    else if (comp_y_i == y_f && ((comp_x_i > x_i && comp_x_i < x_f) || (comp_x_f > x_i && comp_x_f < x_f)))
        return true
    else if (comp_y_f == y_i && ((comp_x_i > x_i && comp_x_i < x_f) || (comp_x_f > x_i && comp_x_f < x_f)))
        return true
    
    return false
}

// here will build the dungeon as follows
// take an initial Nx by Ny sized area and do a BSP algorithm to cut up this region into many subregions


function cut_up(x_size, y_size, iterations) {
    let big_room = new D_Room(x_size, y_size, 0, 0)
    let full_tree = new D_Tree(big_room, [])
    let current_list = [full_tree];
    for (let k = 0; k < iterations; k++ ) {
        let new_list = []
        for (let t = 0; t < current_list.length; t++) {
            // current_list[t] = cut_room(current_list[t])
            cut_room(current_list[t])
            // console.log(current_list[t])
            // console.log(full_tree)
            // console.log("full run")
            new_list.push(current_list[t].child_leaves)
        }
        current_list = new_list.flat()
    }
    return full_tree
}


// in each subregion, choose a random size to create a room inside the subregion 
// some of these should just be 2 by 2 squares so that they are corridors
function make_rooms(tree, iterations, sizex, sizey) {
    let small_rooms = tree.get_level(iterations)
    // console.log(small_rooms)
    // console.log(tree)
    let room_num = small_rooms.length
    let dung_rooms = []
    let extendx = 0
    let extendy = 0
    for (let k = 0; k < room_num; k++ ){ 
        let actual_room = small_rooms[k].node_leaf
        let cur_room
        let rand_cond = Math.random()
        if (rand_cond < 0.15 && !(actual_room.start_x == 0 && actual_room.start_y == 0)) {
            let valx = Math.floor(actual_room.size_x / 2) - 1
            let valy = Math.floor(actual_room.size_y / 2) - 1
            cur_room = new D_Room(2, 2, actual_room.start_x + valx, actual_room.start_y + valy)
        } else {
            let xrand1 = Math.random()
            let xsize;
            if (xrand1 < 1/3)
                xsize = Math.floor(actual_room.size_x / 2) - 1
            else if (xrand1 < 2/3)
                xsize = Math.floor(actual_room.size_x / 2)
            else
                xsize = Math.floor(actual_room.size_x / 2) + 1

            let yrand1 = Math.random()
            let ysize;
            if (yrand1 < 1/3)
                ysize = Math.floor(actual_room.size_y / 2) - 1
            else if (yrand1 < 2/3)
                ysize = Math.floor(actual_room.size_y / 2)
            else
                ysize = Math.floor(actual_room.size_y / 2) + 1

            let starterx = Math.floor(Math.random() * (actual_room.size_x / 2 - 2)) + 1
            let startery = Math.floor(Math.random() * (actual_room.size_y / 2 - 2)) + 1

            cur_room = new D_Room(xsize, ysize, actual_room.start_x + starterx, actual_room.start_y + startery)
        }
        if (actual_room.start_x + actual_room.size_x >= sizex - 1 && actual_room.start_y + actual_room.size_y >= sizey - 1) {
            if (cur_room.size_x < 6) {
                cur_room.size_x += 5
                extendx = 5
            }
            if (cur_room.size_y < 7) {
                cur_room.size_y += 4
                extendy = 4
            }
        }
        dung_rooms.push(cur_room)
    }
    return [dung_rooms, small_rooms, [extendx, extendy]]
}


// then make corridors between regions by connecting neighboring subleafs
// randomly connect some of the subleafs to each other 
// because of the way the random walls have been designed, the corridors can always be in the same location without any issue.

function make_corridor(room1, room2, tree_room1, tree_room2) {
    // if (!is_adjacent_tree_room(tree_room1, tree_room2)) 
    //     return false
    let x_i = tree_room1.start_x
    let y_i = tree_room1.start_y
    let x_f = x_i + tree_room1.size_x
    let y_f = y_i + tree_room1.size_y

    // let adjacent_room = []
    
    let comp_x_i = tree_room2.start_x
    let comp_y_i = tree_room2.start_y
    let comp_x_f = comp_x_i + tree_room2.size_x
    let comp_y_f = comp_y_i + tree_room2.size_y

    let side_case = 0 // initialization condition
    if (comp_x_i == x_f && ((comp_y_i > y_i && comp_y_i < y_f) || (comp_y_f > y_i && comp_y_f < y_f)))
        side_case = 1 // room2 is to the right
    else if (comp_x_f == x_i && ((comp_y_i > y_i && comp_y_i < y_f) || (comp_y_f > y_i && comp_y_f < y_f)))
        side_case = 2 // room2 is to the left
    else if (comp_y_i == y_f && ((comp_x_i > x_i && comp_x_i < x_f) || (comp_x_f > x_i && comp_x_f < x_f)))
        side_case = 3 // room2 is below
    else if (comp_y_f == y_i && ((comp_x_i > x_i && comp_x_i < x_f) || (comp_x_f > x_i && comp_x_f < x_f)))
        side_case = 4 // room2 is above
    
    let corridor_tiles = []
    // corridor to the right from room1 to room2
    if (side_case == 1) {
        let start_y = room1.start_y + Math.floor(Math.random() * (room1.size_y - 2))
        let start_x = room1.start_x + room1.size_x
        let curr_x = start_x
        let end_x = room2.start_x
        while(curr_x < end_x) {
            curr_x++
            corridor_tiles.push([curr_x, start_y])
            corridor_tiles.push([curr_x, start_y + 1])
        }
        let end_y1 = room2.start_y
        let end_y2 = room2.start_y + room2.size_y
        if (start_y > end_y2) {
            corridor_tiles.push([curr_x + 1, start_y])
            corridor_tiles.push([curr_x + 1, start_y + 1])
            corridor_tiles.push([curr_x + 2, start_y])
            corridor_tiles.push([curr_x + 2, start_y + 1])
            let curr_y = start_y
            while (curr_y > end_y2) {
                curr_y--
                corridor_tiles.push([curr_x + 1, curr_y])
                corridor_tiles.push([curr_x + 2, curr_y])
            }
        }
        if (start_y < end_y1){
            corridor_tiles.push([curr_x + 1, start_y])
            corridor_tiles.push([curr_x + 1, start_y + 1])
            corridor_tiles.push([curr_x + 2, start_y])
            corridor_tiles.push([curr_x + 2, start_y + 1])
            let curr_y = start_y
            while (curr_y < end_y1) {
                curr_y++
                corridor_tiles.push([curr_x + 1, curr_y])
                corridor_tiles.push([curr_x + 2, curr_y])
            }
        }
    }
    // corridor to the left from room1 to room2
    if (side_case == 2) {
        let start_y = room1.start_y + Math.floor(Math.random() * (room1.size_y - 2))
        let start_x = room1.start_x
        let curr_x = start_x
        let end_x = room2.start_x + room2.size_x
        while(curr_x > end_x) {
            curr_x--
            corridor_tiles.push([curr_x, start_y])
            corridor_tiles.push([curr_x, start_y + 1])
        }
        let end_y1 = room2.start_y
        let end_y2 = room2.start_y + room2.size_y
        if (start_y > end_y2) {
            corridor_tiles.push([curr_x - 1, start_y])
            corridor_tiles.push([curr_x - 1, start_y + 1])
            corridor_tiles.push([curr_x - 2, start_y])
            corridor_tiles.push([curr_x - 2, start_y + 1])
            let curr_y = start_y
            while (curr_y > end_y2) {
                curr_y--
                corridor_tiles.push([curr_x - 1, curr_y])
                corridor_tiles.push([curr_x - 2, curr_y])
            }
        }
        if (start_y < end_y1){
            corridor_tiles.push([curr_x - 1, start_y])
            corridor_tiles.push([curr_x - 1, start_y + 1])
            corridor_tiles.push([curr_x - 2, start_y])
            corridor_tiles.push([curr_x - 2, start_y + 1])
            let curr_y = start_y
            while (curr_y < end_y1) {
                curr_y++
                corridor_tiles.push([curr_x - 1, curr_y])
                corridor_tiles.push([curr_x - 2, curr_y])
            }
        }
    }
    // corridor going down from room1 to room2
    if (side_case == 3) {
        let start_y = room1.start_y + room1.size_y
        let start_x = room1.start_x + Math.floor(Math.random() * (room1.size_x - 2)) 
        let curr_y = start_y
        let end_y = room2.start_y
        while(curr_y < end_y) {
            curr_y++
            corridor_tiles.push([start_x, curr_y])
            corridor_tiles.push([start_x + 1, curr_y])
        }
        let end_x1 = room2.start_x
        let end_x2 = room2.start_x + room2.size_x
        if (start_x > end_x2) {
            corridor_tiles.push([start_x, curr_y + 1])
            corridor_tiles.push([start_x + 1, curr_y + 1])
            corridor_tiles.push([start_x, curr_y + 2])
            corridor_tiles.push([start_x + 1, curr_y + 2])
            let curr_x = start_x
            while (curr_x > end_x2) {
                curr_x--
                corridor_tiles.push([curr_x, curr_y + 1])
                corridor_tiles.push([curr_x, curr_y + 2])
            }
        }
        if (start_x < end_x1) {
            corridor_tiles.push([start_x, curr_y + 1])
            corridor_tiles.push([start_x + 1, curr_y + 1])
            corridor_tiles.push([start_x, curr_y + 2])
            corridor_tiles.push([start_x + 1, curr_y + 2])
            let curr_x = start_x
            while (curr_x < end_x2) {
                curr_x++
                corridor_tiles.push([curr_x, curr_y + 1])
                corridor_tiles.push([curr_x, curr_y + 2])
            }
        }
    }
    // corridor going up from room1 to room2 
    if (side_case == 4) {
        let start_y = room1.start_y + room1.size_y
        let start_x = room1.start_x + Math.floor(Math.random() * (room1.size_x - 2)) 
        let curr_y = start_y
        let end_y = room2.start_y
        while(curr_y > end_y) {
            curr_y--
            corridor_tiles.push([start_x, curr_y])
            corridor_tiles.push([start_x + 1, curr_y])
        }
        let end_x1 = room2.start_x
        let end_x2 = room2.start_x + room2.size_x
        if (start_x > end_x2) {
            corridor_tiles.push([start_x, curr_y - 1])
            corridor_tiles.push([start_x + 1, curr_y - 1])
            corridor_tiles.push([start_x, curr_y - 2])
            corridor_tiles.push([start_x + 1, curr_y - 2])
            let curr_x = start_x
            while (curr_x > end_x2) {
                curr_x--
                corridor_tiles.push([curr_x, curr_y - 1])
                corridor_tiles.push([curr_x, curr_y - 2])
            }
        }
        if (start_x < end_x1) {
            corridor_tiles.push([start_x, curr_y - 1])
            corridor_tiles.push([start_x + 1, curr_y - 1])
            corridor_tiles.push([start_x, curr_y - 2])
            corridor_tiles.push([start_x + 1, curr_y - 2])
            let curr_x = start_x
            while (curr_x < end_x2) {
                curr_x++
                corridor_tiles.push([curr_x, curr_y - 1])
                corridor_tiles.push([curr_x, curr_y - 2])
            }
        }
    }

    return corridor_tiles
}

function find_best_pairs_rooms(tree_room1, tree_room2, rooms1_tree, rooms2_tree) {
    let x_i = tree_room1.start_x
    let y_i = tree_room1.start_y
    let x_f = x_i + tree_room1.size_x
    let y_f = y_i + tree_room1.size_y

    // let adjacent_room = []
    
    let comp_x_i = tree_room2.start_x
    let comp_y_i = tree_room2.start_y
    let comp_x_f = comp_x_i + tree_room2.size_x
    let comp_y_f = comp_y_i + tree_room2.size_y

    let side_case = 0 // initialization condition
    if (comp_x_i == x_f && ((comp_y_i > y_i && comp_y_i < y_f) || (comp_y_f > y_i && comp_y_f < y_f)))
        side_case = 1 // room2 is to the right
    else if (comp_x_f == x_i && ((comp_y_i > y_i && comp_y_i < y_f) || (comp_y_f > y_i && comp_y_f < y_f)))
        side_case = 2 // room2 is to the left
    else if (comp_y_i == y_f && ((comp_x_i > x_i && comp_x_i < x_f) || (comp_x_f > x_i && comp_x_f < x_f)))
        side_case = 3 // room2 is below
    else if (comp_y_f == y_i && ((comp_x_i > x_i && comp_x_i < x_f) || (comp_x_f > x_i && comp_x_f < x_f)))
        side_case = 4 // room2 is above

    let room_list1 = [...rooms1_tree]
    let room_list2 = [...rooms2_tree] 
    // console.log(rooms1_tree)
    if (side_case == 1) {
        // negative implies that a is further to the right of b (as desired)
        room_list1.sort((a,b) => (b.start_x + b.size_x) - (a.start_x + a.size_x)) 
        room_list2.sort((a,b) => a.start_x - b.start_x)
    }
    else if (side_case == 2) {
        // negative implies that a is further to the right of b (as desired)
        room_list1.sort((a,b) => a.start_x - b.start_x)
        room_list2.sort((a,b) => (b.start_x + b.size_x) - (a.start_x + a.size_x)) 
    }
    else if (side_case == 3) {
        room_list1.sort((a,b) => (b.start_y + b.size_y) - (a.start_y + a.size_y)) 
        room_list2.sort((a,b) => a.start_y - b.start_y)
    }
    else if (side_case == 4) {
        room_list1.sort((a,b) => a.start_y - b.start_y)
        room_list2.sort((a,b) => (b.start_y + b.size_y) - (a.start_y + a.size_y)) 
    }

    return [room_list1, room_list2]
    
}

// function find_room_ind(rooms, room_comp) {
//     // console.log(rooms)
//     for (let l = 0; l < rooms.length; l++) {
//         // console.log("comp")
//         // console.log(room_comp.start_x)
//         // console.log(room_comp.start_y)
//         if (rooms[l].start_x == room_comp.start_x && rooms[l].start_y == room_comp.start_y)
//             return l
//     }
//     return -1
// }

function find_roomtree_ind(rooms_tree, room_comp) {
    // myObject.hasOwnProperty("name")
    let caser = 0
    if (rooms_tree[0].hasOwnProperty("node_leaf"))
        caser++
    if (room_comp.hasOwnProperty("node_leaf"))
        caser+=2

    for (let l = 0; l < rooms_tree.length; l++) {
        if (caser == 0)
            if (rooms_tree[l].start_x == room_comp.start_x && rooms_tree[l].start_y == room_comp.start_y)
                return l
        if (caser == 1)
            if (rooms_tree[l].node_leaf.start_x == room_comp.start_x && rooms_tree[l].node_leaf.start_y == room_comp.start_y)
                return l
        if (caser == 2)
            if (rooms_tree[l].start_x == room_comp.node_leaf.start_x && rooms_tree[l].start_y == room_comp.node_leaf.start_y)
                return l
        if (caser == 3)
            if (rooms_tree[l].node_leaf.start_x == room_comp.node_leaf.start_x && rooms_tree[l].node_leaf.start_y == room_comp.node_leaf.start_y)
                return l
    }
    return -1
}

function place_corridors(act_rooms, tree_rooms, full_tree, iterations){
    let matched_rooms = []
    let corridors = []
    // console.log(full_tree)
    for (let k = iterations - 1; k >= 0; k--) {
        let parent_nodes = full_tree.get_level(k)
        // console.log("k run")
        // console.log(k)
        for (let l = 0; l < parent_nodes.length; l++) {
            // console.log("curr l")
            // console.log(l)
            // there is an indexing issue going on here somewhere 
            // console.log(parent_nodes[l])
            let tree_child1 = parent_nodes[l].child_leaves[0]
            let tree_child2 = parent_nodes[l].child_leaves[1]
            
            let trees1 = tree_child1.get_level(iterations - 1 - k)
            let trees2 = tree_child2.get_level(iterations - 1 - k)
            let rooms1 = []
            let rooms2 = []
            // console.log(tree_rooms)
            
            // console.log(tree_child1)
            // console.log(trees1)
            for (let l = 0; l < trees1.length; l++) {
                let indval = find_roomtree_ind(tree_rooms, trees1[l])
                // console.log(indval)
                rooms1.push(act_rooms[indval])
                
            }
            
            for (let l = 0; l < trees1.length; l++) {
                let indval = find_roomtree_ind(tree_rooms, trees2[l])
                // console.log(trees1[l].node_leaf)
                rooms2.push(act_rooms[indval])
            }
            // console.log("2")
            // console.log(rooms1)
            let output_lists = find_best_pairs_rooms(tree_child1.node_leaf, tree_child2.node_leaf, rooms1, rooms2)
            // let chosen_ind = Math.floor(2 * Math.random())
            // let other_ind = (Math.floor(2 * Math.random()) + 1) % 2
            // let start_list = output_lists[chosen_ind]
            // let other_list = output_lists[other_ind]
            
            
            let counter = 0
            let valer = Math.random()

            while (valer < 1/Math.pow((1 + 1.5 * counter), 2)) {
                // console.log(counter)
                // console.log(valer)
                // console.log(1/Math.pow((1 + 1.5 * counter), 2))
                // chosen_room = start_list[counter]
                // console.log(act_rooms)
                // console.log(output_lists[0])
                // console.log(counter)
                let room1_ind = find_roomtree_ind(act_rooms, output_lists[0][counter])
                let room2_ind = find_roomtree_ind(act_rooms, output_lists[1][counter])
                let new_corr = make_corridor(output_lists[0][counter], output_lists[1][counter], tree_rooms[room1_ind], tree_rooms[room2_ind])
                counter++
                valer = Math.random()
                matched_rooms.push((room1_ind, room2_ind))
                if (counter >= output_lists[0].length)
                    break
                corridors.push(new_corr)
            }
            
            // need to finish section
        }
    }
    let room_4_trees = []
    for (let i = 0; i < tree_rooms.length; i++) {
        room_4_trees.push(tree_rooms[i].node_leaf)
    }
    // for (let k = 0; k < act_rooms.length; k++) {
    //     if (Math.random() < 1/3) {
    //         let adj_rooms = find_adjacent_tree_room(room_4_trees, k)
    //         let ind = Math.floor(Math.random() * adj_rooms.length)
    //         // let tree_ind = act_rooms.findIndex(roomer => roomer.start_x == adj_rooms[ind].start_x && roomer.start_y == adj_rooms[ind].start_y)
    //         console.log(room_4_trees)
    //         console.log(k)
    //         console.log(adj_rooms)
    //         console.log(room_4_trees[adj_rooms[ind]])
    //         let tree_ind = find_roomtree_ind(act_rooms, room_4_trees[adj_rooms[ind]])
    //         // console.log(act_rooms)
    //         // console.log(adj_rooms)
    //         if (matched_rooms.includes((k, tree_ind)) || matched_rooms.includes((tree_ind, k)))
    //             continue
    //         let new_corr = make_corridor(act_rooms[k], room_4_trees[adj_rooms[ind]], room_4_trees[k], room_4_trees[tree_ind])
    //         corridors.push(new_corr)
    //     }
    // }
    return corridors
}
