class Entities{
    setpos(x, y)
    {
        this.x = x;
        this.y = y;
    }
    move(ax, ay)
    {
        // If wall is present cancel movement
        this.x += ax;
        this.y += ay;
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
    drawMe(length, width, color, cell_sizex, cell_sizey)
    {
        let rect = new PIXI.Graphics();
        rect.beginFill(color);
        rect.lineStyle(5 , 0xFFFFFF);
        rect.drawRect(this.x * cell_sizex, this.y * cell_sizey, length, width);
        app.stage.addChild(rect);
    }
    printPos()
    {
        // alert(this.x);
        // alert(this.y);
    }
}
class Player extends Entities
{
    constructor(cell_sizex, cell_sizey)
    {
        // // alert("Here");
        super();
        // super();
        // console.log("hi")
        // super.printHello();
        // console.log("hi2")
        // setHealth(10);
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
        // // alert("5");
        super.setpos(0.25, 0.25);
        // // alert("6");
        // super.move(10, 10);
        // super.printPos();
        super.drawMe(cell_sizex/2, cell_sizey/2, 0xFF0000, cell_sizex, cell_sizey);
        // // alert("7")
        // super.printHello();
        // // alert("8 = End");
    }
}
class Monster extends Entities
{
    constructor(tier, cell_sizex, cell_sizey)
    {
        super();
        super.setSpeed((6 - tier));
        super.setStrength(6 - tier);
        super.setRange(Math.floor(0.5 * (6 - tier)));
        super.setProt((6 - tier), (2 * (6 - tier)));
        super.setpos(Math.floor(Math.random() * app.renderer.width/cell_sizex), Math.floor(Math.random() * app.renderer.height/cell_sizey));
        let color;
        switch(tier)
        {
        case 1:
            color = 0xFF0000
            // // alert(color);
            break;
        case 2:
            color = 0x0000FF
            // // alert("2");
            // // alert(color);
            break;
        case 3:
            color = 0x00FF00
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
        super.drawMe(cell_sizex/tier, cell_sizey/tier, color, cell_sizex, cell_sizey);
        // // alert("Out");
    }
}