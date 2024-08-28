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
    takeDamage(damage)
    {
        this.health -= damage;
        if(this.health - damage <= 0)
        {
            delete this;
        }
    }
    dealDamage(target)
    {
        if(dist(this.x, this.y, target.x, target.y) <= range)
        {
            this.health += 0.2 * this.strength;
            target.takeDamage(this.strength);
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
