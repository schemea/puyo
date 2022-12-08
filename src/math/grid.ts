import { Point, PointLike } from "../model/point";
import { PUYO_SIZE } from "../sprites/puyo";

export function getGridX(position: PointLike) {
    return Math.floor(position.x / PUYO_SIZE + 0.005);
}

export function getGridY(position: PointLike) {
    return Math.floor(position.y / PUYO_SIZE + 0.005);
}

export function getGridCoordinates(position: PointLike) {
    return new Point(getGridX(position), getGridY(position));
}
