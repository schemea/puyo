import { Graphic } from "./graphic";
import { RenderTarget } from "../canvas";
import { PuyoGrid } from "../model/puyo/grid";
import { PUYO_SIZE } from "../sprites/puyo";
import { PuyoGraphic } from "./puyo";
import { Point } from "../model/point";
import { PuyoState } from "../model/puyo/puyo";
import { MessagePubsub } from "../message/pubsub";
import { BoardMessageInterface } from "../message/board";

export class BoardGraphic extends Graphic {

    elements: PuyoGraphic[];

    get size() {
        return new Point(this.grid.width * PUYO_SIZE, this.grid.height * PUYO_SIZE);
    }

    constructor(private readonly messages: MessagePubsub<BoardMessageInterface>, readonly grid: PuyoGrid) {
        super();

        this.elements = [];
    }

    protected _update(elapsed: number): void {
        super._update(elapsed);

        this.elements = this.elements.filter(value => value.state !== PuyoState.BLANK);

        for (let i = this.elements.length - 1; i >= 0; i--) {
            this.elements[i].update(elapsed);
        }
    }

    protected _render(renderer: RenderTarget): void {
        super._render(renderer);

        renderer.fillColor = "black";
        renderer.fillRect(new Point(), this.size);
        for (const element of this.elements) {
            element.render(renderer);
        }
    }
}
