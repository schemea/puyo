export interface PointLike {
    x: number;
    y: number;
}

export type VectorLike = PointLike;
export type SizeLike = PointLike;

export class Point {

    constructor(public readonly x = 0, public readonly y = 0) {
    }

    negate() {
        return new Point(-this.x, -this.y);
    }

    static equals(a: PointLike, b: PointLike) {
        return a.x === b.x && a.y === b.y
    }

    static negate(value: PointLike) {
        return new Point(-value.x, -value.y);
    }

    static add(...points: PointLike[]): Point {
        const {x, y} = points.reduce((a, b) => ({x: a.x + b.x, y: a.y + b.y}));
        return new Point(x, y);
    }

    static subtract(a: PointLike, b: PointLike): Point {
        return new Point(a.x - b.x, a.y - b.y);
    }

    static multiply(...points: PointLike[]): Point {
        const { x, y } = points.reduce((a, b) => ({ x: a.x * b.x, y: a.y * b.y }));
        return new Point(x, y);
    }

    static average(...points: PointLike[]): Point {
        const { x, y } = Point.add(...points);
        return new Point(x / points.length, y / points.length);
    }
}

export const Vector = Point;
export const Size = Point;
