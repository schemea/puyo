import { Point, PointLike, Size, SizeLike, VectorLike } from "../model/point";
import { RenderTarget } from "../canvas";
import { Force } from "../physics/force";
import { Area } from "../model/area";

export abstract class Graphic implements Area {

    forces: Force[] = [];
    anchor = new Point(0, 0);

    position: PointLike = new Point();

    get size(): SizeLike {
        return new Size();
    }

    get min() {
        return this.position;
    }

    get max() {
        return Point.add(this.position, this.size);
    }

    render(renderer: RenderTarget) {
        renderer.save();
        const offset = Point.multiply(this.anchor, this.size).negate();
        renderer.translate(Point.add(this.position, offset));

        this._render(renderer);

        renderer.restore();
    }

    translate(vector: VectorLike) {
        this.position = Point.add(this.position, vector);
    }

    moveTo(point: PointLike) {
        this.position = point;
    }

    update(elapsed: number) {
        for (let i = this.forces.length - 1; i >= 0; i--) {
            if (!this.forces[i].apply(this, elapsed)) {
                this.forces.splice(i, 1);
            }
        }

        this._update(elapsed);
    }

    protected _render(renderer: RenderTarget) {}

    protected _update(elapsed: number) {}
}
