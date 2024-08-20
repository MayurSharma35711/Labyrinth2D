import { print_walls } from "../bkgnd_objs/mazegen.mjs";

function room_gen(startx, starty, xnum, ynum, xsize, ysize, maze, map, new_biome)
{
    // print_walls(maze, xnum, ynum)
    // console.log(xsize)
    // console.log(ysize)
    // let startx = Math.floor(Math.random() * (xnum - xsize - 1));
    // let starty = Math.floor(Math.random() * (ynum - ysize - 1));
    let start_point = starty * xnum + startx;
    // console.log(startx)
    // console.log(starty)
    for(let i = 0;i < ysize;i++)
    {
        if (start_point + i*xnum > map.length)
            break
        for(let k = 0;k < xsize ;k++)
        {
            if ((k + start_point) % xnum == 0)
                break
            maze[2 * start_point + 2 * (i * xnum + k)].exists = false;
            maze[2 * start_point + 2 * (i * xnum + k) + 1].exists = false;
            map[start_point + (i * xnum + k)].biome = new_biome
        }
    }
    for(let i = 0;i < xsize;i++)
    {
        maze[2 * (Math.max(starty * xnum - xnum, 0) + Math.min(i + startx, xnum - 1))].exists = true;
        maze[2 * (Math.min((starty + ysize - 1), ynum -1) * xnum + Math.min(i + startx,xnum - 1))].exists = true;
    }
    for(let i = 0;i < ysize;i++)
    {
        // this case needs to be improved
        maze[2 * (Math.min((starty + i), ynum - 1) * xnum + startx) - 1].exists = true;
        maze[2 * (Math.min((starty + i), ynum - 1) * xnum + Math.min(startx + xsize - 1,xnum - 1)) + 1].exists = true;
    }
    maze[2 * start_point - 1].exists = false;
    maze[2 * start_point - 2*xnum].exists = false;
    // maze[2 * (start_point + (ysize-1) * xnum)].exists = false;
    // maze[2 * (start_point + (ysize-1) * xnum) - 1].exists = false;
    maze[2 * (Math.min((starty + ysize-1), ynum - 1) * xnum + Math.min(startx + xsize - 1,xnum - 1))].exists = false;
    maze[2 * (Math.min((starty + ysize-1), ynum - 1) * xnum + Math.min(startx + xsize - 1,xnum - 1)) + 1].exists = false;
    // maze[2 * (start_point + (xsize-1)) + 1].exists = false;
    // maze[2 * (start_point + (xsize-1)) - xnum].exists = false;
    // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh")
    return [maze, map];
}
export function multiRooms(xnum, ynum, minsize, maxsize, maze, map, room_num)
{
    let room_size1, room_size2, room_startx, room_starty;
    let room_dets = []
    const buffer_x = Math.floor(xnum / 10)
    const buffer_y = Math.floor(ynum / 10)
    let counter = -1
    for(let i = 0;i < room_num;i++)
    {
        counter = counter + 1
        if (counter > 100)
            break
        room_size1 = Math.floor(Math.random() * (maxsize - minsize) + minsize);
        room_size2 = Math.floor(Math.random() * (maxsize - minsize) + minsize);
        room_startx = Math.floor(Math.random() * (xnum - 2*buffer_x)+2);
        room_starty = Math.floor(Math.random() * (ynum - 2*buffer_y)+2);
        let room_biome;
        if (Math.random() > 0.7)
            room_biome = 10
        else
            room_biome = 9
        let x1 = room_startx
        let x2 = room_startx + room_size1
        let y1 = room_starty
        let y2 = room_starty + room_size2
        // console.log("here")
        // console.log(room_dets)
        // console.log(room_startx, room_starty, room_size1, room_size2)
        let k = 0;
        for (; k < room_dets.length; k++){
            let room = room_dets[k]
            if (x1 >= room[0] && x1 <= room[0] + room[2] && y1 >= room[1] && y1 <= room[1] + room[3]) {
                i = i - 1
                break
            }
            if (x2 >= room[0] && x2 <= room[0] + room[2] && y1 >= room[1] && y1 <= room[1] + room[3]) {
                i = i - 1
                break
            }
            if (x1 >= room[0] && x1 <= room[0] + room[2] && y2 >= room[1] && y2 <= room[1] + room[3]) {
                i = i - 1
                break
            }
            if (x2 >= room[0] && x2 <= room[0] + room[2] && y2 >= room[1] && y2 <= room[1] + room[3]) {
                i = i - 1
                break
            }
        }
        if (k < room_dets.length)
            continue
        room_dets.push([room_startx, room_starty, room_size1, room_size2, room_biome])
    }

    let out;
    for (let k = 0; k < room_num; k++) {
        out = room_gen(room_dets[k][0], room_dets[k][1], xnum, ynum, room_dets[k][2], room_dets[k][3], maze, map, room_dets[k][4]);
        maze = out[0]
        map = out[1]
    }
    return [maze, map, room_dets];
}