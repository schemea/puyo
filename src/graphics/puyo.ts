import { getPuyoSprite, PUYO_SIZE } from "../sprites/puyo";
import { Graphic } from "./graphic";
import { RenderTarget } from "../canvas";
import { Point, Size } from "../model/point";
import { PuyoGrid } from "../model/puyo/grid";
import { Diff } from "../diff";

export class PuyoGraphic extends Graphic {
    private readonly diff = new Diff();

    get size() {
        return new Size(PUYO_SIZE, PUYO_SIZE);
    }

    get state() {
        return this.puyo.state;
    }

    set state(value) {
        this.grid.updateState(this.x, this.y, value);
    }

    get puyo() {
        return this.grid.get(this.x, this.y);
    }

    get sprite() {
        return this.diff.cached("puyo", this.puyo, puyo => puyo ? getPuyoSprite(puyo.color, puyo.links) : null);
    }

    constructor(readonly grid: PuyoGrid, public x: number, public y: number) {
        super();
        this.moveTo(new Point(x * PUYO_SIZE, y * PUYO_SIZE));
    }

    protected _render(renderer: RenderTarget): void {
        super._render(renderer);
        const sprite = this.sprite;
        if (sprite) {
            renderer.drawImage(sprite.image, sprite.area.min, sprite.area.size, new Point(), this.size);
        }
    }
}
