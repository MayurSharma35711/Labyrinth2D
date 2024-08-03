let max_world_up = 10;
let max_world_left = 10;
let max_world_right = 10;
let max_world_down = 10;
class Block{
    setBiome(biome)
    {
        this.biome = biome; //biomes can be represented with numbers with similar biomes being close in number
    }
}
const map = [];
const rand = [0, 0];
let max_biome_size = 0;
let biome_num = 5;
for(let i = 0;i < 20;i++)
{
    for(let k = 0;k < 20;k++)
    {
        map[i][k].setBiome(0); //0 means no biome set
    }
}
let num_left = 400; //Counts how many blocks don't have set biomes
function getRandBiomeSize()
{
    while(max_biome_size >= 20 || max_biome_size <= 5) //This assumes the max biome size is 20 and the min biome size is 5
    {
        max_biome_size = Math.random() % 20;
    }
}
function genBiome()
{
    getRandBiomeSize();
    let biome = Math.random() % biome_num;
    let dir; //direction it will go
    let test = 1; //tests whether the direction works
    let fail = 0;
    rand[0] = Math.random() % 20;
    rand[1] = Math.random() % 20;
    for(let i = 0;i < max_biome_size;i++)
    {
        dir = Math.random() % 4;
        switch(dir)
        {
        case 0: //Right
            if(map[rand[0]][rand[1] + 1].biome != 0 && !(rand[1] + 1 >= 20))
            {
                test = 0;
                fail++;
            }
            else
            {
                map[rand[0]][++rand[1]].setBiome(biome);
                test = 1;
                num_left--;
                fail = 0;
                break;
            }
        case 1: //Left
            if(map[rand[0]][rand[1] - 1].biome != 0 && !(rand[1] - 1 <= 20))
            {
                test = 0;
                fail++;
            }
            else
            {
                map[rand[0]][--rand[1]].setBiome(biome);
                test = 1;
                num_left--;
                fail = 0;
                break;
            }
        case 2: //Down
            if(map[rand[0] + 1][rand[1]].biome != 0 && !(rand[0] + 1 >= 20))
            {
                test = 0;
                fail++;
            }                
            else
            {
                map[++rand[0]][rand[1]].setBiome(biome);
                test = 1;
                num_left--;
                fail = 0;
                break;
            }
        case 3: //Up
            if(map[rand[0] - 1][rand[1]].biome != 0 && !(rand[0] - 1 <= 20))
            {
                test = 0;
                fail++;
            }
            else
            {
                map[--rand[0]][rand[1]].setBiome(biome);
                test = 1;
                num_left--;
                fail = 0;
                break;
            }
        }
        if(test >= 4)
        {
            break;
        }
    }
    max_biome_size = 0;
}
function setWorld(times)
{
    for(let i = 0;i < times;i++)
    {
        genBiome();
    }
}
function printWorldBiomes()
{
    for(let i = 0;i < 20;i++)
    {
        for(let k = 0;k < 20;k++)
        {
            console.log(map[i][k].biome + " ");
        }
        console.log("\n");
    }
}
setWorld();
printWorldBiomes();