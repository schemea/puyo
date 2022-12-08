import { Color } from "../model/color";
import { Point, Size } from "../model/point";
import { Area } from "../model/area";
import { Direction } from "../model/direction";
import { Assets } from "../loader";

export const PUYO_SIZE = 31;

function getSize(color: Color) {
    return new Size(PUYO_SIZE, PUYO_SIZE);
}

function getColorY(color: Color) {
    const order: Color[] = [ Color.RED, Color.GREEN, Color.BLUE, Color.YELLOW, Color.PURPLE ];
    return order.indexOf(color) * 32 + 1;
}

function getLinkX(links: number) {
    const { UP, RIGHT, DOWN, LEFT } = Direction;

    const map: Direction[] = [
        0,
        DOWN,
        UP,
        UP | DOWN,
        RIGHT,
        RIGHT | DOWN,
        UP | RIGHT,
        UP | RIGHT | DOWN,
        LEFT,
        DOWN | LEFT,
        LEFT | UP,
        DOWN | LEFT | UP,
        RIGHT | LEFT,
        RIGHT | DOWN | LEFT,
        UP | RIGHT | LEFT,
        UP | RIGHT | DOWN | LEFT,
    ];
    return map.indexOf(links) * 32 + 1;
}

export function getPuyoSprite(color: Color, links = 0) {
    const min = new Point(getLinkX(links), getColorY(color));
    return Assets.aqua.get(new Area(min, Point.add(min, getSize(color))));
}
