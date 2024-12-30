export function x_view_range (center_x, center_y, numx, numy, tier) {

    let curr_pos = center_y * numx + center_x;
    let map_indices = []; // return array

    let left_dist = curr_pos % numx; // tells how far from left wall
    let right_dist = numx - left_dist - 1;
    let up_dist = Math.floor(curr_pos/numx);
    let down_dist = numy - up_dist - 1;

    left_dist = Math.min(left_dist, tier); // dist must be capped at tier
    right_dist = Math.min(right_dist, tier);
    up_dist = Math.min(up_dist, tier);
    down_dist = Math.min(down_dist, tier);

    let tl_dist = Math.min(up_dist, left_dist); // dist must be capped at the most restrictive restraint for each direction
    let tr_dist = Math.min(up_dist, right_dist);
    let bl_dist = Math.min(down_dist, left_dist);
    let br_dist = Math.min(down_dist, right_dist);

    for(let i = 1;i <= tl_dist;i++) // starts at one to eliminate repitions of start sqr
    {
        map_indices.push((center_y - i) * numx + (center_x - i));
    }
    for(let i = 1;i <= tr_dist;i++)
    {
        map_indices.push((center_y - i) * numx + (center_x + i));
    }
    for(let i = 1;i <= bl_dist;i++)
    {
        map_indices.push((center_y + i) * numx + (center_x - i));
    }
    for(let i = 1;i <= br_dist;i++)
    {
        map_indices.push((center_y + i) * numx + (center_x + i));
    }

    map_indices.push(curr_pos); // just for coolness and perfect X
    console.log("left_dist = " + left_dist);
    console.log("right_dist = " + right_dist);
    console.log("down_dist = " + down_dist);
    console.log("up_dist = " + up_dist);
    return map_indices;
}
