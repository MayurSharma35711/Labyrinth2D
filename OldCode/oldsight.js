
// Sight uses visiblity code to show the map tiles and maze tiles that are visible
function sight()
{
    while(vis.children[0])
    {
        vis.removeChild(vis.children[0]);
    }
    while(walls.children[0])
    {
        walls.removeChild(walls.children[0]);
    }
    let map_indices = total_visible_indices(players, xrectnum, yrectnum);
    let curr_player_view = get_view_sqr(curr_player.x, curr_player.y, xrectnum, yrectnum, curr_player.vis_tier)
    let opac_arr = new Array(map_indices.length);
    
    for(let i = 0;i < map_indices.length;i++)
    {
        game_map[map_indices[i]].drawMe(size, size, currx, curry, 0.6);
    }
    for(let i = 0;i < map_indices.length;i++)
    {
        let map_indexer = map_indices[i]
        if(map_indexer < xrectnum) {
            let upwall = PIXI.Sprite.from('/Labyrinth2D/textures/bkgnd/WallsHorizontal.png');
            upwall.height = 0.3 * size;
            upwall.width = size;
            upwall.x = (map_indexer - currx) * size;
            upwall.y = (- curry) * size - 0.15*size;
            walls.addChild(upwall)
        }
        if(map_indexer % xrectnum == 0) {
            let leftwall = PIXI.Sprite.from('/Labyrinth2D/textures/bkgnd/WallsVertical.png');
            leftwall.height = size;
            leftwall.width = 0.3 * size;
            leftwall.x = (0 - currx) * size - 0.15*size;
            leftwall.y = (map_indexer / xrectnum - curry) * size;
            walls.addChild(leftwall)
        }
        if(!map_indices.includes(map_indexer - xrectnum) && map_indexer - xrectnum >= 0) {
            game_maze[2 * map_indices[i] - 2*xrectnum].drawMe(size, size, currx, curry, 0.6);
        }
        if(!map_indices.includes(map_indexer - 1) && map_indexer % xrectnum > 0) {
            game_maze[2 * map_indices[i] - 1].drawMe(size, size, currx, curry, 0.6);
        }
        game_maze[2 * map_indices[i]].drawMe(size, size, currx, curry, 0.6);
        game_maze[2 * map_indices[i] + 1].drawMe(size, size, currx, curry, 0.6);
    }
    for(let i = 0;i < chest_indices.length;i++)
    {
        if(map_indices.includes(chest_indices[i]))
        {
            chests[i].drawMe(size, size, currx, curry);
            // console.log("HERE");
            // console.log(chests[i].x);
            // console.log(chests[i].y);
        }
    }
}
