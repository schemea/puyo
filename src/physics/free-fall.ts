import { Force } from "./force";
import { Point } from "../model/point";
import { PUYO_SIZE } from "../sprites/puyo";
import { PuyoGraphic } from "../graphics/puyo";
import { Direction } from "../model/direction";
import { PuyoState } from "../model/puyo/puyo";

export interface FreeFallOptions {
    readonly speed: number;
    readonly acceleration: number;
    readonly maxSpeed: number;
}

export class FreeFallForce implements Force {
    readonly maxSpeed: number;
    readonly acceleration: number;

    speed: number;

    constructor(options: FreeFallOptions) {
        this.maxSpeed = options.maxSpeed;
        this.acceleration = options.acceleration;
        this.speed = options.speed;
    }

    apply(graphic: PuyoGraphic, elapsed: number): boolean {
        graphic.state = PuyoState.FALLING;
        const frame = elapsed * 60 / 1000;
        graphic.translate(new Point(0, this.speed * frame));

        this.speed += this.acceleration * frame;
        this.speed = Math.min(this.maxSpeed, this.speed);

        const ny = Math.floor(graphic.position.y / PUYO_SIZE);

        if (graphic.grid.collisions(graphic.x, ny) & Direction.DOWN) {
            const color = graphic.puyo.color;
            graphic.grid.remove(graphic.x, graphic.y);
            graphic.grid.set(graphic.x, ny, color);
            graphic.y = ny;
            graphic.state = PuyoState.STATIC;
            graphic.moveTo(Point.multiply(new Point(graphic.x, ny), graphic.size));
            // if (ny !== graphic.y) {
            // } else {
            //     graphic.state = "static";
            // }
            return false;
        }

        return true;
    }
}
