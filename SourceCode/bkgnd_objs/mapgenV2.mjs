function pickRandIndicies(width, height)
{
    let coordinates = new Array(2);
    coordinates[0] = Math.round(Math.random() * width);
    coordinates[1] = Math.round(Math.random() * height);
    // console.log("pickRand ------------------------------------")
    // console.log(coordinates);
    // console.log("---------------------------------------------");
    return coordinates;
}

function genHotspots(width, height, num, hotspot_num) // num is number of dif types of biomes, hotspot_num is number of hotspots
{
    let hotspots = new Array(hotspot_num);
    for(let i = 0;i < hotspot_num;i++)
    {
        hotspots[i] = new Array(3); //0 is x, 1 is y, and 2 is strength
        let coordinate = pickRandIndicies(width, height);
        hotspots[i][0] = coordinate[0];
        hotspots[i][1] = coordinate[1];
        hotspots[i][2] = Math.round(Math.random() * num);
    }
    return hotspots;
}

// planes like things prefer values around 1; rivers and mountains prefer values around 0 and 2
function distance(point1, point2, eccentricity_x = 1) // any value between 0 and 2 is allowed
{
    let x = point1[0] - point2[0];
    let y = point1[1] - point2[1];
    let coeff_x = eccentricity_x + 0.1;
    let coeff_y = 2 - coeff_x + 0.2;
    return Math.sqrt(coeff_x* x * x + coeff_y*y * y);
}

function influence(indice, hotspot, width, height, num) // num is number of hotspots
{
    let x = Math.floor(indice % width);
    let y = Math.floor(indice / width);
    let coordinate = [x, y];
    let hot_loc = new Array(2);
    hot_loc[0] = hotspot[0];
    hot_loc[1] = hotspot[1];
    let dist = distance(hot_loc, coordinate, 1);

    if(dist > 7 || dist < 0.8)
        return 0;

    return hotspot[2] / ((dist) * num); // strength is changed based on 1/r
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
            map[i * width + k] = Math.floor(map[i * width + k]);
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

export function VectorBiomes(map, width, height, num, biome_num)
{
    let arrHotspots = new Array(num);
    arrHotspots = genHotspots(width, height, biome_num, num);
    for(let i = 0;i < height;i++)
    {
        for(let k = 0;k < width;k++)
        {
            map[i * width + k] = 0; // resetting it js in case
            let best_save = 0; // saves index of the best one
            let best = 10000; // influence(i * width + k, arrHotspots[0], width, height, num); // actually calculates the best influence
            for(let l = 0; l < num; l++)
            {
                // console.log(arrHotspots[0] + ", " + arrHotspots[1] + ", " + arrHotspots[2] + "\n");
                let hotspot_coords = new Array(2);
                hotspot_coords[0] = arrHotspots[l][0];
                hotspot_coords[1] = arrHotspots[l][1];
                let index = new Array(2);
                index[0] = k;
                index[1] = i;
                if(distance(hotspot_coords, index) < best)
                {
                    best = distance(hotspot_coords, index); // influence(i * width + k, arrHotspots[l], width, height, num);
                    best_save = l;
                }
                // map[i * width + k] = hotspot[2];
            }
            map[i * width + k] = arrHotspots[best_save][2];
            console.log(map[i * width + k] + ", " + arrHotspots[best_save] + " This is important");
            // map[i * width + k] *= 100;
            // map[i * width + k] = Math.floor(map[i * width + k]);
        }
    }
    console.log("HOTSPOTS---------------------------------------------");
    console.log(arrHotspots);
    console.log("-----------------------------------------------------");
    return map;
}