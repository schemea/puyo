import { Graphic } from "./graphic";
import { PUYO_SIZE } from "../sprites/puyo";
import { Point } from "../model/point";
import { RenderTarget } from "../canvas";
import { Direction } from "../model/direction";
import { BoardGraphic } from "./board";
import { PuyoGraphic } from "./puyo";
import { getGridCoordinates } from "../math/grid";
import { getIntFrames } from "../math/frames";
import { Matrix } from "../math/matrix";
import { PuyoGrid } from "../model/puyo/grid";
import { FreeFallForce } from "../physics/free-fall";
import { PuyoState } from "../model/puyo/puyo";
import {MessagePubsub} from "../message/pubsub";

export class DropGraphic extends Graphic {

    softDrop = false;
    elements: PuyoGraphic[] = [];

    private leftOverFrame = 0;
    private drop_?: PuyoGrid;

    get drop() {
        return this.drop_;
    }

    set drop(value) {
        this.drop_ = value;
        this.elements = [];
        if (value) {
            value.forEach((puyo, x, y) => this.elements.push(new PuyoGraphic(value, x, y)));
        }
    }

    get grid() {
        return this.board.grid;
    }

    constructor(readonly messages: MessagePubsub, readonly player: number, readonly board: BoardGraphic, readonly regularSpeed = 16, readonly softDropSpeed = 2) {
        super();
        this.anchor = new Point(PUYO_SIZE, PUYO_SIZE);
    }

    getCollisions() {
        if (!this.drop) return 0;
        const drop = this.drop;

        const check = (x: number, y: number) => {
            let collisions = 0;
            drop.forEach((puyo, px, py) => {
                if (puyo.state === PuyoState.STATIC) collisions |= this.grid.collisions(x + px, y + py);
            });
            return collisions;
        };

        const { x, y } = getGridCoordinates(this.position);
        let collisions = check(x, y);
        if (this.position.y % PUYO_SIZE > 3) {
            collisions |= check(x, y + 1) & (Direction.LEFT | Direction.RIGHT);
        }

        return collisions;
    }

    rotate(direction: Direction) {
        if (!this.drop) return;
        const { width, height } = this.drop;

        const transform = Matrix.multiply(
            Matrix.translate(1, 1),
            Matrix.rotate(Math.PI / 2 * (direction === Direction.RIGHT ? 1 : -1)),
            Matrix.translate(-1, -1),
        );

        const newDrop = new PuyoGrid(width, height);

        this.drop.forEach((puyo, x, y) => {
            if (puyo.state !== PuyoState.STATIC) return;
            const vector = new Matrix(3, 1, [ x, y, 1 ]);
            const [ nx, ny ] = Matrix.multiply(transform, vector).data.map(x => Math.round(x));
            newDrop.set(nx, ny, puyo.color);
        });

        this.drop = newDrop;
    }

    protected _update(elapsed: number): void {
        super._update(elapsed);
        if (!this.drop) return;

        const speed = PUYO_SIZE / (this.softDrop ? this.softDropSpeed : this.regularSpeed);
        const [ frames, leftOver ] = getIntFrames(elapsed, this.leftOverFrame);
        this.leftOverFrame = leftOver;
        this.translate(new Point(0, frames * speed));

        const collisions = this.getCollisions();
        if (collisions & Direction.DOWN) {
            const { x, y } = getGridCoordinates(this.position);

            this.drop.forEach((puyo, dx, dy) => {
                if (puyo.state === PuyoState.STATIC) {
                    this.messages.publish({
                        component: "board",
                        resource: "puyo",
                        action: "set",
                        color: puyo.color,
                        player: this.player,
                        position: {
                            x: x + dx,
                            y: y + dy
                        },
                    })
                    // this.grid.set(x + dx, y + dy, puyo.color);
                    //
                    // const graphic = new PuyoGraphic(this.grid, x + dx, y + dy);
                    // this.board.elements.push(graphic);
                    // if (!(this.grid.collisions(graphic.x, graphic.y) & Direction.DOWN)) {
                    //     graphic.forces.push(new FreeFallForce(this.messages, {
                    //         player: this.player,
                    //         speed: 1,
                    //         acceleration: 0.2,
                    //         maxSpeed: 20,
                    //     }));
                    // }
                }
            });

            this.drop = undefined;
            return;
        }
    }

    protected _render(renderer: RenderTarget): void {
        super._render(renderer);

        if (!this.drop) return;

        for (const element of this.elements) {
            element.render(renderer);
        }
    }
}
