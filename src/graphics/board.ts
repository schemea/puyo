import {Graphic} from "./graphic";
import {RenderTarget} from "../canvas";
import {PuyoGrid} from "../model/puyo/grid";
import {PUYO_SIZE} from "../sprites/puyo";
import {PuyoGraphic} from "./puyo";
import {Point, PointLike} from "../model/point";
import {PuyoState} from "../model/puyo/puyo";
import {MessagePubsub} from "../message/pubsub";
import {PuyoMessage} from "../message/puyo";
import {forResource} from "../message/message";
import {DIRECTIONS, getDirectionCoordinates} from "../model/direction";
import {FreeFallForce} from "../physics/free-fall";

export class BoardGraphic extends Graphic {

    elements: PuyoGraphic[];

    get size() {
        return new Point(this.grid.width * PUYO_SIZE, this.grid.height * PUYO_SIZE);
    }

    constructor(private readonly messages: MessagePubsub<PuyoMessage>, readonly player: number, readonly grid: PuyoGrid) {
        super();

        this.elements = [];

        messages
            .pipe(forResource("puyo"))
            .subscribe(this.handlePuyoMessage.bind(this))
    }

    protected _update(elapsed: number): void {
        super._update(elapsed);

        this.elements = this.elements.filter(value => value.state !== PuyoState.BLANK);

        for (let i = this.elements.length - 1; i >= 0; i--) {
            this.elements[i].update(elapsed);
        }
    }

    protected _render(renderer: RenderTarget): void {
        super._render(renderer);

        renderer.fillColor = "black";
        renderer.fillRect(new Point(), this.size);
        for (const element of this.elements) {
            element.render(renderer);
        }
    }

    private handlePuyoMessage(msg: PuyoMessage) {
        switch (msg.action) {
            case "move": {
                const {from, to} = msg;
                const {color} = this.grid.get(from.x, from.y);
                this.grid.remove(from.x, from.y);
                this.grid.set(to.x, to.y, color);

                this.elements = this.elements.filter(graphic => !Point.equals(graphic, from));
                this.elements.push(new PuyoGraphic(this.grid, to.x, to.y));

                this.checkPuyoGroup(to);
                break;
            }
            case "set": {
                const {position, color} = msg
                const {x, y} = position;

                this.grid.set(x, y, color);
                this.elements = this.elements.filter(graphic => !Point.equals(graphic, position));
                this.elements.push(new PuyoGraphic(this.grid, x, y));

                this.checkPuyoGroup(position);
                this.checkFall({x: position.x, y: this.grid.height - 1});
                break;
            }
            case "remove": {
                const {position} = msg
                const {x, y} = position;
                this.grid.remove(x, y);

                this.checkFall(position)
                break;
            }

            default:
                throw new Error("unknown puyo action")
        }
    }

    private checkPuyoGroup(position: PointLike) {

        const grid = this.grid;
        const puyo = grid.get(position.x, position.y);
        const color = puyo.color;

        if (puyo.state !== PuyoState.STATIC) return;

        function check(position: PointLike, group = new Map<string, PointLike>()) {
            if (grid.get(position.x, position.y).color !== color) return group;

            group.set(`${position.x}-${position.y}`, position);
            const collisions = grid.collisions(position.x, position.y);
            for (const direction of DIRECTIONS) {
                if (collisions & direction) {
                    const coord = Point.add(position, getDirectionCoordinates(direction));
                    const neighborKey = `${coord.x}-${coord.y}`;
                    if (!group.has(neighborKey)) {
                        check(coord, group);
                    }
                }
            }

            return group;
        }

        const group = check(position);
        if (group.size >= 4) {
            group.forEach(position => {
                grid.remove(position.x, position.y)
                this.checkFall(position);
            });
        }
    }

    private checkFall(position: PointLike) {
        for (let y = position.y; y >= 0; y--) {
            const puyo = this.grid.get(position.x, y);
            if (puyo.state !== PuyoState.STATIC) {
                this.elements
                    .filter(graphic => graphic.state === PuyoState.STATIC && graphic.x === position.x && graphic.y < y)
                    .filter(graphic => !graphic.forces.some(force => force instanceof FreeFallForce))
                    .forEach(graphic => graphic.forces.push(new FreeFallForce(this.messages, {
                        player: this.player,
                        speed: 1,
                        acceleration: 0.2,
                        maxSpeed: 20,
                    })))
            }
        }
    }
}
