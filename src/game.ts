import { Player } from "./model/puyo/player";
import { Ruleset, Rulesets } from "./loader";
import { RenderTarget } from "./canvas";
import { generateDrop, PuyoGrid } from "./model/puyo/grid";
import { BoardGraphic } from "./graphics/board";
import { Point } from "./model/point";
import { FreeFallForce, FreeFallOptions } from "./physics/free-fall";
import { InputSource } from "./input/source";
import { DropGraphic } from "./graphics/drop";
import { Direction } from "./model/direction";
import { PUYO_SIZE } from "./sprites/puyo";
import { MessagePubsub } from "./message/pubsub";
import { forComponent, forResource } from "./message/message";
import { PuyoMessage } from "./message/puyo";
import { forBoard } from "./message/board";

export class PuyoGame {
    readonly players: Player[] = [];
    readonly ruleset: Ruleset;

    readonly inputSources: InputSource[][] = [];

    readonly boards: BoardGraphic[] = [];
    readonly droppings: DropGraphic[] = [];

    constructor(readonly messages: MessagePubsub, players: number = 1) {
        this.ruleset = Rulesets.fever;

        for (let i = 0; i < players; i++) {
            this.players.push({
                score: 0,
                grid: new PuyoGrid(),
                character: "",
                garbage: 0,
            });
            this.boards.push(new BoardGraphic(this.messages.pipe(forBoard(i)), i, this.players[i].grid));
            this.droppings.push(new DropGraphic(messages, i, this.boards[i]));
            this.inputSources.push([]);
        }

        for (let i = 1; i < players; i++) {
            this.boards[i].translate(new Point(this.boards[i - 1].max.x + 10, 0));
        }

        let timestamp = 0;
        requestAnimationFrame(newTimestamp => {
            const elapsed = newTimestamp - timestamp;
            timestamp = newTimestamp;
            this.update(elapsed);
        });

        messages.pipe(
            forComponent("board"),
            forResource("puyo"),
        ).subscribe(value => {
        });
    }

    update(elapsed: number) {
        for (let i = 0; i < this.players.length; i++) {
            const board = this.boards[i];
            const dropping = this.droppings[i];
            const player = this.players[i];
            const inputSources = this.inputSources[i];
            let isSoftDropping = false;

            for (const inputSource of inputSources) {
                inputSource.update(elapsed);
                if (inputSource.isDirectionActive(Direction.DOWN)) {
                    isSoftDropping = true;
                }
            }

            dropping.softDrop = isSoftDropping;
            dropping.update(elapsed);
            board.update(elapsed);

            if (!dropping.drop) {
                dropping.drop = generateDrop();
                dropping.moveTo(new Point(PUYO_SIZE, -PUYO_SIZE));
            }
        }
    }

    render(renderer: RenderTarget) {
        for (const board of this.boards) {
            board.render(renderer);
        }

        for (let i = 0; i < this.droppings.length; i++) {
            const dropping = this.droppings[i];
            renderer.save();
            renderer.translate(this.boards[i].position);
            dropping.render(renderer);
            renderer.restore();
        }
    }

    addInputSource(player: number, source: InputSource) {
        this.inputSources[player].push(source);
        const dropping = this.droppings[player];
        source.events.direction.subscribe((direction, active) => {
            if (!active) return;

            const collisions = dropping.getCollisions();
            if (collisions & direction) return;
            switch (direction) {
                case Direction.LEFT:
                    dropping.translate(new Point(-PUYO_SIZE, 0));
                    break;
                case Direction.RIGHT:
                    dropping.translate(new Point(PUYO_SIZE, 0));
                    break;
            }
        });

        source.events.rotation.subscribe((direction, active) => {
            if (!active || !dropping.drop) return;
            dropping.rotate(direction);
        });
    }


}
