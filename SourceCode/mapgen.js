//#include <iostream>
//#include <stdio.h>
//#include <stdlib.h>
//#include <time.h>
//#include <windows.h>
//alert("Here");
console.log(Math.random);
//alert(Math.random);
var max_biomesize = 35;
var min_biomesize = 10;
var amtbiomes = 8;
var length = 40;
var width = 40;
var map = [];
/*randNum()
{
	int b = 0;
	for (int i = 0; i < rand() % 6; i++)
	{
		b += rand();
	}
	return b;
}*/
function getRandBiomeSize()
{
	let biome = 0;
	do
	{
		biome = Math.floor(Math.random() * (max_biomesize - min_biomesize) + min_biomesize) % max_biomesize;
        //alert("HereBiomeSize");
	} while (biome >= max_biomesize || biome < min_biomesize);
    //alert("OutBiomeSize");
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

function setBiome()
{
	//srandNum(time(NULL));
	let biome;
	do
	{
        //alert("HereWhile1SetBiome");
		biome = Math.floor(Math.random() * 8) % amtbiomes;
	} while(biome == 0);
    //alert("OutWhile1SetBiome");
	let randNum_f = [];
	let fail = 0;
	do
	{
        //alert("HereWhile2setBiomeAgain...");
        //alert(randNum_f[0] + " " + randNum_f[1]);
        //alert(map[randNum_f[0] * width + randNum_f[1]]);
		randNum_f[0] = Math.floor(length * Math.random()) % length;
		randNum_f[1] = Math.floor(width * Math.random()) % width;
	} while (map[randNum_f[0] * width + randNum_f[1]] != 0);
    //alert("OutWhile2SetBiome");
	for (let i = 0; i < getRandBiomeSize();i++)
	{
        //alert("InForLoopSetBiome")
		if (fail == 0)
		{
			dir = Math.floor(Math.random() * 3);
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
			if (randNum_f[0] + 1 >= length/* || map[randNum_f[0] + 1][randNum_f[1]] != 0*/)
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
    //alert("OutForLoopSetBiome");
}
function multiBiomes(times)
{
    //alert("InMultiBiome");
	for (let i = 0; i < times; i++)
	{
        //alert("BeforeSetBiomeCallMultibiome");
		setBiome();
        //alert("AfterSetBiomeCallMultiBiome");
	}
    //alert("OutMultiBiome");
}
function set()
{
    //alert("HereSet");
	for (let i = 0; i < length; i++)
	{
		for (let k = 0; k < width; k++)
		{
			map[i * width + k] = 0;
		}
	}
    //alert("OutSet");
}

set();
multiBiomes(10);
//fillIn(amtbiomes);
//std::cout << std::endl;
for (let i = 0; i < length; i++)
{
	for (let k = 0; k < width; k++)
	{
		if (map[i * width + k] == 0)
		{
            console.log("- ");
			continue;
		}
        console.log("real " + map[i * width + k] + " ");
//		std::cout << map[i][k] << " ";
	}
//	std::cout << std::endl << std::endl;
}
alert("End");
console.log("End");
	//std::cout << std::endl << std::endl << "1 is ocean, 2 is rain forest, 3 is snow, 4 is snowy forest\n5 is desert, 6 is savvanah, 7 is mountains, 8 is plains";
