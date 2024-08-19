import { print_walls } from "../bkgnd_objs/mazegen.mjs";

function room_gen(xnum, ynum, xsize, ysize, maze)
{
    // print_walls(maze, xnum, ynum)
    // console.log(xsize)
    // console.log(ysize)
    let startx = Math.floor(Math.random() * (xnum - xsize - 1));
    let starty = Math.floor(Math.random() * (ynum - ysize - 1));
    let start_point = starty * xnum + startx;
    // console.log(startx)
    // console.log(starty)
    for(let i = 0;i < ysize;i++)
    {
        for(let k = 0;k < xsize ;k++)
        {
            maze[2 * start_point + 2 * (i * xnum + k)].exists = false;
            maze[2 * start_point + 2 * (i * xnum + k) + 1].exists = false;
        }
    }
    for(let i = 0;i < xsize;i++)
    {
        maze[2 * (starty * xnum + i - xnum + startx)].exists = true;
        maze[2 * ((starty + ysize - 1) * xnum + i + startx)].exists = true;
    }
    for(let i = 0;i < ysize;i++)
    {
        // this case needs to be improved
        maze[2 * ((starty + i) * xnum + startx) - 1].exists = true;
        maze[2 * ((starty + i) * xnum + startx + xsize - 1) + 1].exists = true;
    }
    maze[2 * start_point - 1].exists = false;
    maze[2 * start_point - 2*xnum].exists = false;
    // maze[2 * (start_point + (ysize-1) * xnum)].exists = false;
    // maze[2 * (start_point + (ysize-1) * xnum) - 1].exists = false;
    maze[2 * (start_point + (ysize-1) * xnum + (xsize-1))].exists = false;
    maze[2 * (start_point + (ysize-1) * xnum + (xsize-1)) + 1].exists = false;
    // maze[2 * (start_point + (xsize-1)) + 1].exists = false;
    // maze[2 * (start_point + (xsize-1)) - xnum].exists = false;
    // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh")
    return maze;
}
export function multiRooms(xnum, ynum, minsize, maxsize, maze, room_num)
{
    let room_size1, room_size2;
    for(let i = 0;i < room_num;i++)
    {
        room_size1 = Math.floor(Math.random() * (maxsize - minsize) + minsize);
        room_size2 = Math.floor(Math.random() * (maxsize - minsize) + minsize);
        maze = room_gen(xnum, ynum, room_size1, room_size2, maze);
    }
    return maze;
}