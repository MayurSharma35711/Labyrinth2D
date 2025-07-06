function pickRandIndicies(width, height)
{
    let coordinates = new Array(2);
    coordinates[0] = Math.round(Math.random() * width);
    coordinates[1] = Math.round(Math.random() * height);
    console.log("pickRand ------------------------------------")
    console.log(coordinates);
    console.log("---------------------------------------------");
    return coordinates;
}

function genHotspots(width, height, num, hotspot_num) // num is number of dif tyeps of biomes, hotspot_num is number of hotspots
{
    let hotspots = new Array(hotspot_num);
    for(let i = 0;i < hotspot_num;i++)
    {
        hotspots[i] = new Array(3); //0 is x, 1 is y, and 2 is strength
        let coordinate = pickRandIndicies(width, height);
        hotspots[i][0] = coordinate[0];
        hotspots[i][1] = coordinate[1];
        hotspots[i][2] = Math.round(Math.random() % num);
    }
    return hotspots;
}

function distance(point1, point2)
{
    let x = point1[0] - point2[0];
    let y = point1[1] - point2[1];
    return Math.sqrt(x * x + y * y);
}

function influence(indice, hotspot, width, height, num) // num is number of hotspots
{
    let x = Math.floor(indice % width);
    let y = Math.floor(indice / width);
    let coordinate = [x, y];
    let hot_loc = new Array(2);
    hot_loc[0] = hotspot[0];
    hot_loc[1] = hotspot[1];
    let dist = distance(hot_loc, coordinate);

    if(dist > 7 || dist < 0.8)
        return 0;

    return hotspot[2] / (dist * num); // strength is changed based on 1/r
}

export function genBiomes(map, width, height, num, biome_num) // num is number of hotspots and biome_num is number of different types of biomes
{
    let arrHotspots = new Array(num);
    arrHotspots = genHotspots(width, height, biome_num, num);
    for(let i = 0;i < height;i++)
    {
        for(let k = 0;k < width;k++)
        {
            map[i * width + k] = 0; // resetting it js in case
            for(let l = 0;l < num;l++)
            {
                // console.log(arrHotspots[0] + ", " + arrHotspots[1] + ", " + arrHotspots[2] + "\n");
                map[i * width + k] += influence(i * width + k, arrHotspots[l], width, height, num);
            }
            map[i * width + k] *= 100;
            map[i * width + k] = Math.round(map[i * width + k]);
        }
    }
    return map;
}

export function displayMap(map, width, height) // map is not array of tiles, js array of heat vals
{
    for(let i = 0;i < height;i++)
    {
        for(let k = 0;k < width;k++)
        {
            console.log(map[i * width + k]);
            console.log(' ');
        }
        console.log('\n');
    }
}