import { Entities } from "./entity_classes.mjs";
import { size, tot_height, tot_width } from "../vis_updated.mjs";
export class Player extends Entities
{
    constructor( player_ind, sizex, sizey, vis_tier, name)
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
        // // alert("2");
        super.setStrength(4);
        // // alert("3");
        // // alert("4");
        super.setProt(0, 0);
        super.setVis(vis_tier);
        // // alert("5");
        super.setpos(0, 0);
        super.setRange(Math.min(2, vis_tier));

        this.player_ind = player_ind
        this.name = name
        this.atk_str = true;
        this.range_type = "regular";
        
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

        this.bkg_rect = new PIXI.Graphics();
        this.bkg_rect.rect(-sizex/20, -sizey/20, sizex / 2 + sizex/10, sizey/2+ sizey/10)
        this.bkg_rect.fill(0xFFFF00)
        this.bkg_rect.visible = false

        this.in_combat = false;
        this.turn_end = false;
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
        this.rect.x = (this.x - currx + 0.25) * sizex + Math.floor(tot_width / 2)
        this.rect.y = (this.y - curry + 0.25) * sizey + Math.floor(tot_height / 2)
        this.bkg_rect.x = this.rect.x
        this.bkg_rect.y = this.rect.y
        if (this.health <= 0) {
            console.log('here')
            if (this.player_ind == 0)
                this.rect.fill(0x770000);
            else if (this.player_ind == 1)
                this.rect.fill(0x007700);
            else if (this.player_ind == 2)
                this.rect.fill(0x000077);
            else if (this.player_ind == 3)
                this.rect.fill(0x770077);
        }
        // console.log(this.rect.x, this.rect.y)
        // this.rect.setStrokeStyle(10, 0x8888FF);
    }
    resize(sizex, sizey) {
        this.bkg_rect.width = sizex / 2 + sizex/10
        this.bkg_rect.height = sizey / 2 + sizey/10
        this.rect.width = sizex / 2
        this.rect.height = sizey / 2
    }
    // moveMe(cell_sizex, cell_sizey, ax, ay)
    // {
    //     super.x += ax;
    //     super.y += ay;
    //     super.drawMe(cell_sizex/2, cell_sizey/2, 0xFF0000, cell_sizex, cell_sizey);
    // }
}