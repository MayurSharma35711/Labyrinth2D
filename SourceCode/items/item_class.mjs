export const body_appendage = Object.freeze({
    head: 0,
    torso: 1,
    right_arm: 2,
    left_arm: 3,
    legs: 4
});

// this is literally anything that could be in a chest or in inventory
// so monster parts, random elemental item, tomes, artifacts, potions, weapons, armor, collectibles, money, etc.
export class Item{
    constructor(name)
    {
        this.name = name
    }
    attach_sprite(sprite) {
        this.sprite = sprite
    }
}

// this is specifically for armor, weapons, tomes, and things like that which characters would use
export class Equipment extends Item
{
    constructor(name)
    {
        super(name)
    }
}


export class Armor extends Equipment{
    constructor(name, element, tier, body_part){
        super(name)
        this.element = element
        this.tier = tier
        this.body_part = body_part
    }
    set_effects(str, speed, prot, dur, range, hlth, vis) {
        this.strength_boost = str;
        this.speed_boost = speed;
        this.prot_boost = prot;
        this.durability_boost = dur;
        this.range_boost = range;
        this.health_boost = hlth;
        this.vis_boost = vis;
    }
}

// this class handles both things like swords, spears, bows, guns, but also magical tomes, artifacts, and instruments
// the 'ismagic' variable gives how to assign damage the weapon does
export class Weapon extends Equipment{
    constructor(name, element, tier, sub_class, weapon_type, ismagic){
        super(name)
        this.element = element
        this.tier = tier
        this.sub_class = sub_class
        this.weapon_type = weapon_type
        this.ismagic = ismagic
    }
    set_effects(str, speed, prot, dur, range, hlth, vis) {
        this.strength_boost = str;
        this.speed_boost = speed;
        this.prot_boost = prot;
        this.durability_boost = dur;
        this.range_boost = range;
        this.health_boost = hlth;
        this.vis_boost = vis;
    }
}

// potions are different from normal equipment, they can be drunk, thrown or used for other potions
export class Potion extends Item{
    constructor(name, tier, potion_type, area_range, drink_num){
        super(name)
        this.tier = tier
        this.potion_type = potion_type
        this.area_range = area_range
        this.drink_num = drink_num
    }
}

// here come items that will just be loaded into your inventory that you use for other things
export class Collectible extends Item{
    constructor(name, type) {
        super(name)
        this.type = type
    }
}