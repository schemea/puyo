import { Point, PointLike, SizeLike } from "./point";

export class Area {

    constructor(public min: PointLike = new Point(), public max: PointLike = new Point()) {}

    get size(): SizeLike {
        return Point.subtract(this.max, this.min);
    }
}
