import { Point } from "./point";

export enum Direction {
    UP    = 0b0001,
    RIGHT = 0b0010,
    DOWN  = 0b0100,
    LEFT  = 0b1000,
}

export const DIRECTIONS = [
    Direction.UP,
    Direction.RIGHT,
    Direction.DOWN,
    Direction.LEFT,
];

export function getDirectionCoordinates(direction: Direction) {
    switch (direction) {
        case Direction.UP:
            return new Point(0, -1);
        case Direction.RIGHT:
            return new Point(1, 0);
        case Direction.DOWN:
            return new Point(0, 1);
        case Direction.LEFT:
            return new Point(-1, 0);
        default:
            throw new Error("unknown direction");
    }
}

export function getReverseDirection(direction: Direction) {
    switch (direction) {
        case Direction.UP:
            return Direction.DOWN;
        case Direction.RIGHT:
            return Direction.LEFT;
        case Direction.DOWN:
            return Direction.UP;
        case Direction.LEFT:
            return Direction.RIGHT;
    }
}
