import { Graphic } from "./graphic";
import { RenderTarget } from "../canvas";
import { Area } from "../model/area";
import { Point } from "../model/point";


export class SpriteGraphic extends Graphic {

    get size() {
        return this.area.size;
    }

    constructor(public sheet: CanvasImageSource, public area: Area) {
        super();
    }

    protected _render(renderer: RenderTarget): void {
        super._render(renderer);
        renderer.drawImage(this.sheet, this.area.min, this.area.size, new Point(), this.size);
    }
}

