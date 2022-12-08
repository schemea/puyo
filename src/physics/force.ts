import { Graphic } from "../graphics/graphic";
import { Point, PointLike, VectorLike } from "../model/point";


export interface Force {
    apply(graphic: Graphic, elapsed: number): boolean;
}

export class ConstantForce implements Force {
    vector: PointLike;

    constructor(x: number, y: number);
    constructor(vector: VectorLike);
    constructor(...args: [ number, number ] | [ VectorLike ]) {
        switch (args.length) {
            case 1:
                [ this.vector ] = args;
                break;
            case 2:
                this.vector = new Point(...args);
                break;
        }
    }

    apply(graphic: Graphic, elapsed: number) {
        const vector = { x: this.vector.x * elapsed * 0.001, y: this.vector.y * elapsed * 0.001 };
        graphic.translate(vector);

        return true;
    }

}
