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
    constructor(x, y)
    {
        let item_num = 2 + Math.floor(Math.random() * 3);
        let items = new Array(item_num);
        for(let i = 0;i < item_num;i++)
        {
            switch(Math.floor(Math.random() * 8))
            {
            case 0:
                items[i] = new binoculars;
                break;
            case 1:
                items[i] = new helmet;
                break;
            case 2:
                items[i] = new chestplate;
                break;
            case 3:
                items[i] = new snowBoots;
                break;
            case 4:
                items[i] = new crossbow;
                break;
            case 5:
                items[i] = new bow;
                break;
            case 6:
                items[i] = new rocket_launcher;
                break;
            case 7:
                items[i] = new pistol;
                break;
            }
            // alert(items[i].name);
        }
        this.x = x;
        this.y = y;
    }
}
