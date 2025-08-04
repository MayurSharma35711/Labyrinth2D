import { vis } from "../vis_updated.mjs";
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/items/Chests.png');
await PIXI.Assets.load('https://mayursharma35711.github.io/Labyrinth2D/textures/items/ChestsOpen.png');

// SourceCode/game_entities/monster.mjs
class equipment
{
    constructor()
    {
        this.strength_boost = 0;
        this.speed_boost = 0;
        this.prot_boost = 0;
        this.durability_boost = 0;
        this.range_boost = 0;
        this.health_boost = 0;
        this.vis_boost = 0;
    }
    setName(name)
    {
        this.name = name;
    }
}
class pistol extends equipment
{
    constructor()
    {
        super();
        super.strength_boost = 2;
        super.range_boost = 2; 
        super.setName("pistol");
    }
}
class rocket_launcher extends equipment
{
    constructor()
    {
        super();
        super.strength_boost = 7;
        super.range_boost = 3;
        super.setName("rocket_launcher");
    }
}
class bow extends equipment
{
    constructor()
    {
        super();
        super.strength_boost = 4;
        super.range_boost = 2;
        super.setName("bow");
    }
}
class crossbow extends equipment
{
    constructor()
    {
        super();
        super.strength_boost = 4;
        super.range_boost = 3;
        super.setName("crossbow");
    }
}
class snowBoots extends equipment
{
    constructor()
    {
        super();
        super.speed_boost = 2;
        super.setName("snowBoots");
    }
}
class chestplate extends equipment
{
    constructor()
    {
        super();
        let tier = Math.floor(Math.random() * 4);
        super.prot_boost = (6 - tier);
        super.durability_boost = (9 - tier);
        super.setName("chestplate");
    }
}
class helmet extends equipment
{
    constructor()
    {
        super();
        let tier = Math.floor(Math.random() * 4);
        super.prot_boost = 2;
        super.durability_boost = (11 - tier);
        super.vis_boost = 1;
        super.setName("helmet");
    }
}
class binoculars extends equipment
{
    constructor()
    {
        super();
        super.vis_boost = 4;
        super.setName("binoculars");
    }
}
export class chest
{
    constructor(x, y, width)
    {
        this.item_num = 2 + Math.floor(Math.random() * 3);
        this.items = new Array(this.item_num);
        for(let i = 0;i < this.item_num;i++)
        {
            switch(Math.floor(Math.random() * 8))
            {
            case 0:
                this.items[i] = new binoculars;
                break;
            case 1:
                this.items[i] = new helmet;
                break;
            case 2:
                this.items[i] = new chestplate;
                break;
            case 3:
                this.items[i] = new snowBoots;
                break;
            case 4:
                this.items[i] = new crossbow;
                break;
            case 5:
                this.items[i] = new bow;
                break;
            case 6:
                this.items[i] = new rocket_launcher;
                break;
            case 7:
                this.items[i] = new pistol;
                break;
            }
            // alert(items[i].name);
        }
        this.x = x;
        this.y = y;
        this.index = this.y * width + this.x;
        this.opened = false;
    }
    drawMe(cell_width, cell_height, currx, curry)
    {
        if(this.opened)
        {
            this.sprite = PIXI.Sprite.from('../textures/items/ChestsOpen.png');
            this.sprite.width = 0.7 * cell_width;
            this.sprite.height = 0.7 * cell_height;
            this.sprite.x = (this.x + 0.15 - currx) * cell_width;
            this.sprite.y = (this.y + 0.12 - curry) * cell_height;
            vis.addChild(this.sprite);
        }
        else
        {
            this.sprite = PIXI.Sprite.from('../textures/items/Chests.png');
            this.sprite.width = 0.7 * cell_width;
            this.sprite.height = 0.7 * cell_height;
            this.sprite.x = (this.x + 0.15 - currx) * cell_width;
            this.sprite.y = (this.y + 0.12 - curry) * cell_height;
            vis.addChild(this.sprite);
        }
    }
    Open()
    {
        this.opened = true;
    }
    listItems()
    {
        for(let i = 0;i < this.item_num;i++)
        {
            alert(this.items[i].name);
        }
    }
}
export function chest_gen(chest_num, maze, width, height)
{
    let index;
    let ct;
    let chests = [];
    let chest_ct = 0;
    for(let i = 0;i < height;i++)
    {
        for(let k = 0;k < width;k++)
        {
            ct = 0;
            index = 2 * (width * i + k);
            if(maze[index].getWall())
            {
                ct++;
            }
            if(index - 2 * width >= 0 && maze[index - 2 * width].getWall())
            {
                ct++;
            }
            if(maze[index + 1].getWall())
            {
                ct++;
            }
            if(index - 1 >= 0 && maze[index - 1].getWall())
            {
                ct++;
            }
            if(ct >= 3 && Math.floor(Math.random() * 3) == 0)
            {
              chests[chest_ct] = new chest(k, i, width);
            //   console.log(chests[chest_ct].index);
              chest_ct++;
              // alert(i);
              // alert(k);
              chest_num--;
            }
            if(chest_num <= 0)
            {
              break;
            }
        }
        if(chest_num <= 0)
        {
          break;
        }
    }
    return chests;
}