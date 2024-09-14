export function inRange(attacker, target_pos, monster_indices, monsters, xrectnum, game_maze)
{
    if(!monster_indices.includes(target_pos))
        return false;
    let target = monsters[monster_indices.indexOf(target_pos)];
    let atk_pos = attacker.y * xrectnum + attacker.x;
    if(target_pos == atk_pos)
        return false;
    if(attacker.atk_str)
    {
        if(Math.abs(atk_pos - target_pos) % xrectnum != 0 && ~~((atk_pos) / xrectnum) != ~~(target_pos / xrectnum))
            return false;
        let dir;
        if((atk_pos - target_pos) % xrectnum == 0 && atk_pos - target_pos > 0)
            dir = 0; // dir is up
        else if((atk_pos - target_pos) % xrectnum == 0 && atk_pos - target_pos < 0)
            dir = 1; // dir is down
        else if(atk_pos - target_pos < 0 && ~~((atk_pos) / xrectnum) == ~~(target_pos / xrectnum))
            dir = 2; // dir is right
        else if(atk_pos - target_pos > 0 && ~~((atk_pos) / xrectnum) == ~~(target_pos / xrectnum))
            dir = 3; // dir is left
        else
        {
            console.log("OH NO!")
            console.log(atk_pos + " and " + target_pos);
        }
        let pos;
        switch(dir)
        {
        case 0:
            pos = atk_pos - xrectnum;
            while(pos != target_pos)
            {
                if(game_maze[2 * pos].exists)
                    return false;
                pos -= xrectnum
            }
            if(game_maze[2 * target_pos].exists)
                return false;
            break;
        case 1:
            pos = atk_pos;
            while(pos != target_pos)
            {
                if(game_maze[2 * pos].exists)
                    return false;
                pos += xrectnum
            }
            break;
        case 2:
            pos = atk_pos;
            while(pos != target_pos)
            {
                if(game_maze[2 * pos + 1].exists)
                    return false;
                pos++;
            }
            break;
        case 3:
            pos = atk_pos;
            while(pos != target_pos)
            {
                if(2 * pos - 1 > 0)
                {
                    if(game_maze[2 * pos - 1].exists)
                        return false;
                    pos--;
                    break;
                }
            }
            break;
        }
        // console.log(dir);
        // dealDamage(attacker, monsters[monster_indices.indexOf(target_pos)]);
        // console.log(monsters[monster_indices.indexOf(target_pos)].health);
        console.log("HIT");
        return true;
    }
}