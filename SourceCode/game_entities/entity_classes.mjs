export class Entities{
    constructor()
    {
        this.speed = 1;
        this.blks_moved = 0;
    }
    setpos(x, y)
    {
        this.x = x;
        this.y = y;
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
