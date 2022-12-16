import {Force} from "./force";
import {Point} from "../model/point";
import {PUYO_SIZE} from "../sprites/puyo";
import {PuyoGraphic} from "../graphics/puyo";
import {Direction} from "../model/direction";
import {PuyoState} from "../model/puyo/puyo";
import {MessagePubsub} from "../message/pubsub";
import {FPS} from "../math/frames";

export interface FreeFallOptions {
    readonly player: number;
    readonly speed: number;
    readonly acceleration: number;
    readonly maxSpeed: number;
}

export class FreeFallForce implements Force {
    readonly maxSpeed: number;
    readonly acceleration: number;
    readonly player: number

    speed: number;

    constructor(readonly messages: MessagePubsub, options: FreeFallOptions) {
        this.maxSpeed = options.maxSpeed;
        this.acceleration = options.acceleration;
        this.speed = options.speed;
        this.player = options.player
    }

    apply(graphic: PuyoGraphic, elapsed: number): boolean {
        const frame = elapsed * FPS / 1000;
        graphic.translate(new Point(0, this.speed * frame));

        this.speed += this.acceleration * frame;
        this.speed = Math.min(this.maxSpeed, this.speed);

        const ny = Math.floor(graphic.position.y / PUYO_SIZE);
        if (graphic.grid.collisions(graphic.x, ny) & Direction.DOWN) {
            this.messages.publish({
                component: "board",
                resource: "puyo",
                action: "move",
                from: {x: graphic.x, y: graphic.y},
                to: {x: graphic.x, y: ny},
                player: this.player
            })
            return false;
        } else {
            graphic.state = PuyoState.FALLING;
        }

        return true;
    }
}
