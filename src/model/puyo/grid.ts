import {Puyo, PuyoState} from "./puyo";
import {Direction, DIRECTIONS, getDirectionCoordinates, getReverseDirection} from "../direction";
import {Point, PointLike} from "../point";
import {Color} from "../color";
import {PropertyReference} from "../../reference";

export const PUYO_GRID_WIDTH = 6;
export const PUYO_GRID_HEIGHT = 13;

export class PuyoGrid {
    items: Puyo[] = [];

    constructor(readonly width = PUYO_GRID_WIDTH, readonly height = PUYO_GRID_HEIGHT) {
        this.items = new Array(width * height).fill({color: "blank", state: "blank", links: 0});
    }

    reference(x: number, y: number): { value: Puyo } {
        if (x < 0 || this.width <= x
            || y < 0 || this.height <= y) {
            return { value: { state: PuyoState.INVALID, links: 0, color: Color.BLANK } };
        }

        return new PropertyReference(this.items, this.width * y + x);
    }

    get(x: number, y: number) {
        return this.reference(x, y).value;
    }

    set(x: number, y: number, color: Color) {
        this.reference(x, y).value = { color, state: PuyoState.STATIC, links: 0 };
        this.updatePuyoLinks(x, y);
    }

    remove(x: number, y: number) {
        const ref = this.reference(x, y);
        const links = ref.value.links;

        ref.value = { color: Color.BLANK, state: PuyoState.BLANK, links: 0 };
        const position = new Point(x, y);
        for (const direction of DIRECTIONS) {
            if (links & direction) {
                const { x: nx, y: ny } = Point.add(position, getDirectionCoordinates(direction));
                this.removeLink(nx, ny, getReverseDirection(direction));
            }
        }
    }

    updateState(x: number, y: number, state: Puyo["state"]) {
        const ref = this.reference(x, y);
        ref.value = { ...ref.value, state };
    }

    forEach(callback: (puyo: Puyo, x: number, y: number) => void) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const puyo = this.get(x, y);
                callback(puyo, x, y);
            }
        }
    }

    collisions(x: number, y: number) {
        if (this.get(x, y).state === PuyoState.INVALID) return 0;

        let collisions = 0;
        for (const direction of DIRECTIONS) {
            const { x: dx, y: dy } = getDirectionCoordinates(direction);
            const neighbor = this.get(x + dx, y + dy);
            if (neighbor.state === PuyoState.INVALID || neighbor.state === PuyoState.STATIC) collisions |= direction;
        }
        return collisions;
    }

    updatePuyoLinks(x: number, y: number) {
        if (this.get(x, y).state !== PuyoState.STATIC) return;
        const position = new Point(x, y);

        this.clearLinks(x, y);
        this.evaluateLink(position, Direction.UP);
        this.evaluateLink(position, Direction.RIGHT);
        this.evaluateLink(position, Direction.DOWN);
        this.evaluateLink(position, Direction.LEFT);
    }

    private evaluateLink(position: PointLike, direction: Direction) {
        const coordinates = getDirectionCoordinates(direction);
        const { x: nx, y: ny } = Point.add(position, coordinates);
        const neighbor = this.get(nx, ny);
        const puyo = this.get(position.x, position.y);

        if (!neighbor) return;

        if (puyo.color === neighbor.color && puyo.state === neighbor.state) {
            this.addLink(position.x, position.y, direction);
            this.addLink(nx, ny, getReverseDirection(direction));
        }
    }

    private clearLinks(x: number, y: number) {
        const ref = this.reference(x, y);
        ref.value = { ...ref.value, links: 0 };
    }

    private addLink(x: number, y: number, direction: Direction) {
        const ref = this.reference(x, y);
        ref.value = { ...ref.value, links: ref.value.links | direction };
    }

    private removeLink(x: number, y: number, direction: Direction) {
        const ref = this.reference(x, y);
        ref.value = { ...ref.value, links: ref.value.links & ~direction };
    }
}


export function generateDrop() {
    const grid = new PuyoGrid(3, 3);
    grid.set(1, 1, Color.RED);
    grid.set(1, 2, Color.GREEN);

    return grid;
}
