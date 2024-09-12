import { Entities } from "./entity_classes.mjs";

// shoudl have isOccupied condition for tile, so that if monsters or players are on tile, you can't move onto it
export class Monster extends Entities
{
    constructor(tier, sizex, sizey, num_x, num_y)
    {
        super();
        super.setSpeed((6 - tier));
        super.setStrength(6 - tier);
        super.setRange(Math.floor(0.5 * (6 - tier)));
        super.setProt((6 - tier), (2 * (6 - tier)));
        super.setpos(Math.floor(Math.random() * num_x), Math.floor(Math.random() * num_y));
        super.setHealth((9 - tier) * 2);
        switch(tier)
        {
        case 1:
            this.color = 0xFFCC00
            // // alert(color);
            break;
        case 2:
            this.color = 0x00BBFF
            // // alert("2");
            // // alert(color);
            break;
        case 3:
            this.color = 0x00FF77
            // // alert(3)
            // // alert(color);
            break;
        case 4:
            color = 0x6011FF
            // // alert(4)
            // // alert(color)
            break;
        case 5:
            color = 0xBB1F71
            // // alert(6);
            // // alert(color)
            break;
        default:
            // // alert("BAD");
            break;
        }
        // // alert(color);
        // // alert("Here");
        super.printPos();
        // super.drawMe(cell_sizex/tier, cell_sizey/tier, color, cell_sizex, cell_sizey);
        // // alert("Out");
        // this.x = indx
        // this.y = indy
        this.rect = new PIXI.Graphics();
        this.rect.rect(0, 0, sizex/2, sizey/2);
        this.rect.fill(this.color);
        // this.drawMe(cell_sizex, cell_sizey, 0, 0)
    }
    drawMe (sizex,sizey, currx, curry) {
        // this.spr.x = (this.x - relx)
        this.rect.x = (this.x - currx + 0.25) * sizex + 500
        this.rect.y = (this.y - curry + 0.25) * sizey + 400
    }
    resize (sizex, sizey) {
        this.rect.width = sizex / 2
        this.rect.height = sizey / 2
    }
}