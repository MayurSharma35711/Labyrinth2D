import { get_view_range } from "../graphics/visibility.mjs";

export function inRange(curr_player, target_pos, xrectnum, game_maze, monster_indices)
{
    if(!get_view_range(curr_player.x, curr_player.y, xrectnum, game_maze.length/xrectnum, curr_player.range, game_maze).includes(target_pos))
        return false;
    if(monster_indices.includes(target_pos))
    {
        console.log("HIT");
        return true;
    }
}