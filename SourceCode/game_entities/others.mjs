import { Entities } from "./entity_classes.mjs";
import { size, tot_height, tot_width } from "../vis_updated.mjs";
export class Other extends Entities
{
    constructor(sizex, sizey, label, type) {
        super()
        this.type = type
        this.label = label
        super.setHealth(3); 
        super.setSpeed(0);
    }
}