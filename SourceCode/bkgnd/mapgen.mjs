// import { plain_text, lava_text, rocky_text } from "../map_graphics2.mjs";

class Tile {
	biome = 0;
	ind_x = 0;
	ind_y = 0;
	tile_image;
	color;
	text;
    constructor (ind_x, ind_y) {
        this.biome = 0
		this.ind_x = ind_x
		this.ind_y = ind_y
		this.color = 0x08b208;
		this.rendered = false;
    }
	setColor () {
		
		switch(this.biome){
			case 0:
				//Set Color To Biome Plains
				this.color = 0x08b208;
				this.text = PIXI.loader.shared('/Users/mayur/Documents/Github/Labyrinth2D/Textures/bkgnd/Plains.png');
				// var plain_text = 
				break;
			// case 1:
			// 	//Set Color To Biome Snowy
			// 	this.color = 0xFFFFFF;
			// 	break;
			// case 2:
			// 	//Set Color To Biome Desert
			// 	this.color = 0xccc621;
			// 	break;
			// case 3:
			// 	//Set Color To Biome ShadowLands
			// 	this.color = 0x000065;
			// 	break;
			// case 4:
			// 	//Set Color To Biome Poison Field
			// 	this.color = 0xAc0fB1;
			// 	break;
			// case 5:
			// 	//Set Color To Biome Muddy RainForest
			// 	this.color = 0x85552e;
			// 	break;
			// case 6:
			// 	//Set Color To Biome river / water biome
			// 	this.color = 0x3299FF;
			// 	break;
			case 1:
				//Set Color To Biome Volcano
				this.color = 0xDA306e;
				this.text = PIXI.loader.shared('/Users/mayur/Documents/Github/Labyrinth2D/Textures/bkgnd/Lava.png');
				break;
			case 2:
				//Set Color To Rocky / Mountain
				this.color = 0x666699;
				this.text = PIXI.loader.shared('/Users/mayur/Documents/Github/Labyrinth2D/Textures/bkgnd/RockyArea.png');
				break;
			// case 9:
			//     //Set Color To Biome Forest
			//     this.color = 0x0c870c;
			//     break;
			default:
				console.log(this.biome)
			}
	}
	setBiome(biome){
		this.biome = biome
		this.setColor()
	}
	getBiome(){
		return this.biome
	}
	drawTile(cell_width,cell_height){
		// console.log(this.color)
		this.tile_image = new PIXI.Sprite(this.text);
		// this.tile_image = new PIXI.Graphics();
		// this.tile_image.beginFill(this.color);
		// this.tile_image.drawRect((cell_width)*this.ind_x, (cell_height)*this.ind_y,cell_width,cell_height);
	}
}

function getRandBiomeSize(min_biomesize, max_biomesize)
{
	let biome = 0;
	do
	{
		biome = Math.floor(Math.random() * (max_biomesize - min_biomesize) + min_biomesize) % max_biomesize;
        //// alert("HereBiomeSize");
	} while (biome >= max_biomesize || biome < min_biomesize);
    //// alert("OutBiomeSize");
	return biome;
}


function setBiome(width, height, amtbiomes, min_biomesize, max_biomesize, map)
{
	//srandNum(time(NULL));
	let biome;
	do
	{
        // alert("HereWhile1SetBiome");
		biome = Math.floor(Math.random() * amtbiomes) % amtbiomes;
	} while(biome == 0);
    // alert("OutWhile1SetBiome");
	let randNum_f = [];
	let fail = 0;
	let dir;
	do
	{
        // alert("HereWhile2setBiomeAgain...");
		randNum_f[0] = Math.floor(height * Math.random()) + Math.floor(height / 2);
		randNum_f[1] = Math.floor(width * Math.random()) + Math.floor(width / 2);
		randNum_f[0] %= height;
		randNum_f[1] %= width;
		// alert(randNum_f[0] + " " + randNum_f[1]);
        // alert(map[randNum_f[0] * width + randNum_f[1]]);
	} while (map[randNum_f[0] * width + randNum_f[1]].getBiome() != 0);
	// console.log(randNum_f[0],randNum_f[1])
    // alert("OutWhile2SetBiome");
	for (let i = 0; i < getRandBiomeSize(min_biomesize, max_biomesize);i++)
	{
        //// alert("InForLoopSetBiome")
		if (fail == 0)
		{
			dir = Math.floor(Math.random() * 4);
		}
		switch (dir)
		{
		case 0: //Right
			if (randNum_f[1] + 1 >= width/* || map[randNum_f[0]][randNum_f[1] + 1] != 0*/)
			{
				fail++;
			}
			else
			{
				fail = 0;
				map[randNum_f[0] * width + ++randNum_f[1]].setBiome(biome);
				//std::cout << 0;
				break;
			}
		case 1: //Left
			if (randNum_f[1] - 1 < 0/* || map[randNum_f[0]][randNum_f[1] - 1] != 0*/)
			{
				fail++;
			}
			else
			{
				fail = 0;
				map[randNum_f[0] * width + --randNum_f[1]].setBiome(biome);
				//std::cout << 1;
				break;
			}
		case 2: //Up
			if (randNum_f[0] - 1 < 0/* || map[randNum_f[0] - 1][randNum_f[1]] != 0*/)
			{
				fail++;
			}
			else
			{
				fail = 0;
				map[--randNum_f[0] * width + randNum_f[1]].setBiome(biome);
				//std::cout << 2;
				break;
			}
		case 3:
			if (randNum_f[0] + 1 >= height/* || map[randNum_f[0] + 1][randNum_f[1]] != 0*/)
			{
				fail++;
			}
			else
			{
				fail = 0;
				map[++randNum_f[0] * width + randNum_f[1]].setBiome(biome);
				//std::cout << 3;
				break;
			}
		}
		if (fail >= 4)
		{
			break;
		}
	}
	return map;
    //// alert("OutForLoopSetBiome");
}
function set(width, height)
{
	let map = Array(width, height);
    //// alert("HereSet");
	for (let i = 0; i < height; i++)
	{
		for (let k = 0; k < width; k++)
		{
			map[i * width + k] = new Tile(k, i)
		}
	}
    //// alert("OutSet");
	return map;
}
function multiBiomes(times, width, height, amtbiomes, min_biomesize, max_biomesize)
{
	let map = set(width, height);
    // alert("InMultiBiome");
	for (let i = 0; i < times; i++)
	{
		map = setBiome(width, height, amtbiomes, min_biomesize, max_biomesize, map);
	}
	return map;
}

export function print_map(map, width, height) {
    let strval = ""
	let indval;
	let charval;
    for (let k = 0; k < height; k++) {
        for (let l = 0; l < width; l++) {
			indval = map[l+k*width].getBiome()
            charval = indval + " "
            if (indval == 0)
                charval = "- "
            strval = strval + charval
        }
        strval = strval + "\n"
    }
    console.log(strval)
}

export function map_init(xrectnum, yrectnum) {
	let cell_num = xrectnum * yrectnum
	const map = multiBiomes(Math.min(Math.floor(cell_num / 30), 40), xrectnum, yrectnum, 3, Math.floor(cell_num / 20), Math.floor(cell_num * 3/ 20));
	return map
}