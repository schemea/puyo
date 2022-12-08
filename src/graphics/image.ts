import { Graphic } from "./graphic";
import { RenderTarget } from "../canvas";

export class ImageGraphic extends Graphic {

    constructor(readonly image: HTMLImageElement) {
        super();
    }

    protected _render(renderer: RenderTarget): void {
        super._render(renderer);
        renderer.drawImage(this.image);
    }
}
