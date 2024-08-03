let max_world_left = 10;
let max_world_down = 10;
let max_world_up = 10;
let max_world_right = 10;
function dist(x1, y1, x2, y2)
{
    return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
}
class equip{
    constructor()
    {
        this.speed_boost = 0;
        this.prot_boost = 0;
        this.durability_boost = 0;
        this.health_boost = 0;
        this.strength_boost = 0;
        this.range_boost = 0;
    }
}
class Entity{
    constructor(start_posx, start_posy)
    {
        this.posx = start_posx;
        this.posy = start_posy;
    }
    move(ax, ay)
    {
        this.posx += ax;
        this.posy += ay;
    }
    setHealth(health)
    {
        this.health = health;
    }
    setSpeed(speed)
    {
        this.speed = speed;
    }
    setStrength(strength)
    {
        this.strength = strength;
    }
    setRange(range)
    {
        this.range = range;
    }
    setProt(prot, durability)
    {
        this.prot = prot;
        this.durability = durability;
    }
    takeDamage(damage)
    {
        damage -= this.prot;
        this.durability--;
        if(this.durability <= 0)
        {
            this.prot = 0;
        }
        this.health -= damage;
        if(health <= 0)
        {
            delete this;
        }
    }
    dealDamage(target)
    {
        if(dist(target.posx, target.posy, this.posx, this.posy) <= this.range)
        {
            target.takeDamage(this.strength);
        }
    }
    grabObj(Obj)
    {
        this.setStrength(Obj.strength_boost);
        this.setRange(Obj.range_boost);
        this.setSpeed(Obj.speed_boost);
        this.setHealth(Obj.health_boost);
        this.setProt(Obj.prot_boost, Obj.durability_boost);
    }
}
class Player extends Entity{
    constructor(start_posx, start_posy) //Sets all base stats
    {
        super(start_posx, start_posy);
        setHealth(10);
        setProt(0, 0);
        setStength(4);
        setSpeed(1);
        setRange(1);
    }
}
class Monster extends Entity{
    constructor(start_posx, start_posy, tier)
    {
        super(start_posx, start_posy);
        setHealth((6 - tier) * 4);
        setProt(0, 0);
        setStength((6 - tier) * 1.5);
        setSpeed(6 - tier);
        setRange((6 - tier) * 0.75);
    }
}