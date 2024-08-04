// {import Hello from "./Dependency_Test"};
//#include <iostream>
//#include <stdio.h>
//#include <stdlib.h>
//#include <time.h>
//#include <windows.h>
//// alert("Here");
console.log(Math.random);
//// alert(Math.random);
//var max_biomesize = 35;
//var min_biomesize = 10;
//var amtbiomes = 8;
//var height = 40;
//var width = 40;
//var map = [];
/*randNum()
{
	int b = 0;
	for (int i = 0; i < rand() % 6; i++)
	{
		b += rand();
	}
	return b;
}*/
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
/*int getRandDir()
{
	srand(time(NULL));
	return rand() % 4;
}
int getRandBiome()
{
	srand(time(NULL));
	return rand() % amtbiomes;
}
void getRandIndex(int* p) 
{
	srand(time(NULL));
	*p = rand() % 20;
	*(p + 1) = rand() % 20;
}*/

function setBiome(width, height, amtbiomes, min_biomesize, max_biomesize, map)
{
	//srandNum(time(NULL));
	let biome;
	do
	{
        // alert("HereWhile1SetBiome");
		biome = Math.floor(Math.random() * 8) % amtbiomes;
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
	} while (map[randNum_f[0] * width + randNum_f[1]] != 0);
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
				map[randNum_f[0] * width + ++randNum_f[1]] = biome;
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
				map[randNum_f[0] * width + --randNum_f[1]] = biome;
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
				map[--randNum_f[0] * width + randNum_f[1]] = biome;
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
				map[++randNum_f[0] * width + randNum_f[1]] = biome;
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
			map[i * width + k] = 0;
		}
	}
    //// alert("OutSet");
	return map;
}
export function multiBiomes(times, width, height, amtbiomes, min_biomesize, max_biomesize)
{
	let map = set(width, height);
    // alert("InMultiBiome");
	for (let i = 0; i < times; i++)
	{
        // alert("BeforeSetBiomeCallMultibiome");
		map = setBiome(width, height, amtbiomes, min_biomesize, max_biomesize, map);
        // alert("AfterSetBiomeCallMultiBiome");
	}
	// for (let i = 0; i < height; i++)
	// {
	// 	for (let k = 0; k < width; k++)
	// 	{				
	// 		if (map[i * width + k] == 0)
	// 		{	
	// 			console.log("- ");
	// 			continue;
	// 		}
	// 		console.log("real " + map[i * width + k] + " ");
	// 		// std::cout << map[i][k] << " ";
	// 	}
	// 	// std::cout << std::endl << std::endl;
	// }
	return map;
    // alert("OutMultiBiome");
}

export function print_map(map, width, height) {
    // console.log(walls)
    let strval = ""
	// alert("got to print")
	let indval;
	let charval;
	// console.log(map[0])
    for (let k = 0; k < height; k++) {
        for (let l = 0; l < width; l++) {
			// if (k == 0) {
			// 	console.log(map[l])
			// }
			indval = map[l+k*width]
            charval = indval + " "
            if (indval == 0)
                charval = "- "
            strval = strval + charval
        }
        strval = strval + "\n"
    }
    console.log(strval)
}



// multiBiomes(10, 5, 5, 3, 4, 10);
//fillIn(amtbiomes);
//std::cout << std::endl;
// alert("End");
// console.log("End");
	//std::cout << std::endl << std::endl << "1 is ocean, 2 is rain forest, 3 is snow, 4 is snowy forest\n5 is desert, 6 is savvanah, 7 is mountains, 8 is plains";
//import {Hello} from './Dependency_Test.mjs';
//// alert(Hello());
//let v = Hello();
//// alert(v);