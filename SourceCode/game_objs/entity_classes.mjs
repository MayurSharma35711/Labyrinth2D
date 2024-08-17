class Entities{
    setpos(x, y)
    {
        this.x = x;
        this.y = y;
    }
    takeDamage(damage)
    {
        this.health -= damage;
        if(this.health - damage <= 0)
        {
            delete this;
        }
    }
    dealDamage(damage, target)
    {
        if(dist(this.x, this.y, target.x, target.y) <= range)
        {
            this.health += 0.2 * damage;
            target.takeDamage(damage);
        }
    }
    setSpeed(speed)
    {
        this.speed = speed;
    }
    setStrength(strength)
    {
        this.strength = strength;
    }
    setHealth(health)
    {
        this.health = health;
        // console.log(this.health);
    }
    setProt(durability, prot)
    {
        this.durability = durability;
        this.prot = prot;
    }
    setRange(range)
    {
        this.range = range;
    }
    setVis(vis)
    {
        this.vis_tier = vis;
    }
    move(ax, ay)
    {
        // If wall is present cancel movement
        this.x += ax;
        this.y += ay;
        console.log(this.x);
        console.log(this.y);
    }
    printPos()
    {
        // alert(this.x);
        // alert(this.y);
    }
}
export class Player extends Entities
{
    constructor( player_ind, sizex, sizey)
    {
        // // alert("Here");
        super();
        // super();
        // console.log("hi")
        // super.printHello();
        // console.log("hi2")
        super.setHealth(10);
        // // alert("0");
        // setHealth(10);
        // // alert("1");
        super.setSpeed(4);
        // // alert("2");
        super.setStrength(4);
        // // alert("3");
        super.setRange(1);
        // // alert("4");
        super.setProt(0, 0);
        super.setVis(2);
        // // alert("5");
        super.setpos(0, 0);
        this.player_ind = player_ind
        
        this.rect = new PIXI.Graphics();
        this.rect.rect(0, 0, sizex/2, sizey/2);
        if (this.player_ind == 0)
            this.rect.fill(0xFF0000);
        else if (this.player_ind == 1)
            this.rect.fill(0x00FF00);
        else if (this.player_ind == 2)
            this.rect.fill(0x0000FF);
        else if (this.player_ind == 3)
            this.rect.fill(0xFF00FF);
        // // alert("6");
        // super.move(10, 10);
        // super.printPos();
        // super.drawMe(cell_sizex/2, cell_sizey/2, 0xFF0000, cell_sizex, cell_sizey);
        // // alert("7")
        // super.printHello();
        // // alert("8 = End");
        // this.drawMe()
        // console.log(this.x)
        // this.drawMe(cell_sizex, cell_sizey)
    }
    drawMe (sizex,sizey, currx, curry) {
        this.rect.x = (this.x - currx + 0.25) * sizex + 500
        this.rect.y = (this.y - curry + 0.25) * sizey + 400
        // this.rect.setStrokeStyle(10, 0x8888FF);
    }
    // moveMe(cell_sizex, cell_sizey, ax, ay)
    // {
    //     super.x += ax;
    //     super.y += ay;
    //     super.drawMe(cell_sizex/2, cell_sizey/2, 0xFF0000, cell_sizex, cell_sizey);
    // }
}
export class Monster extends Entities
{
    constructor(tier, cell_sizex, cell_sizey, num_x, num_y)
    {
        super();
        super.setSpeed((6 - tier));
        super.setStrength(6 - tier);
        super.setRange(Math.floor(0.5 * (6 - tier)));
        super.setProt((6 - tier), (2 * (6 - tier)));
        super.setpos(0.25+Math.floor(Math.random() * num_x), 0.25+Math.floor(Math.random() * num_y));
        switch(tier)
        {
        case 1:
            this.color = 0xFF0000
            // // alert(color);
            break;
        case 2:
            this.color = 0x0000FF
            // // alert("2");
            // // alert(color);
            break;
        case 3:
            this.color = 0x00FF00
            // // alert(3)
            // // alert(color);
            break;
        // case 4:
        //     color = 0x888888
        //     // // alert(4)
        //     // // alert(color)
        //     break;
        // case 5:
        //     color = 0x111111
        //     // // alert(6);
        //     // // alert(color)
        //     break;
        default:
            // // alert("BAD");
            break;
        }
        // // alert(color);
        // // alert("Here");
        super.printPos();
        // super.drawMe(cell_sizex/tier, cell_sizey/tier, color, cell_sizex, cell_sizey);
        // // alert("Out");
        this.drawMe(cell_sizex, cell_sizey)
    }
    drawMe (sizex,sizey) {
        this.arect = new PIXI.Graphics();
        this.arect.beginFill(this.color);
        this.arect.lineStyle(5, 0x00FF88);
        this.arect.drawRect(this.x * sizex, this.y * sizey, sizex/2, sizey/2);
    }
}