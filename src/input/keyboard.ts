import { Events, InputSource } from "./source";
import { EventPublisher } from "../event";
import {Direction} from "../model/direction";
import {FPS} from "../math/frames";

interface InputState {
    frames: number;
    active: boolean;
    lastEmission: number;
    type: "rotation" | "movement";
}

export class KeyboardSource implements InputSource {
    readonly events: Events = {
        direction: new EventPublisher(),
        rotation: new EventPublisher(),
    };


    private readonly keyState = new Map<any, InputState>();

    constructor(container: HTMLElement) {
        container.addEventListener("keydown", this.handleKeyEvent(true));
        container.addEventListener("keyup", this.handleKeyEvent(false));
    }

    update(elapsed: number): void {
        for (const [ key, value ] of this.keyState.entries()) {
            if (!value.active) continue;

            value.frames += elapsed * FPS / 1000;
            const frames = Math.floor(value.frames);

            // emit once every 2 frames
            if (value.lastEmission > 0 && frames & 1) continue;

            // repeat only after 8 frames
            if (value.lastEmission >= 0 && frames < 15) continue;

            value.lastEmission = frames;

            if (value.type === "movement") this.events.direction.emit(this.movementFromKey(key)!, true);
            else if (value.type === "rotation") this.events.rotation.emit(this.rotationFromKey(key)!, true);
        }
    }

    isDirectionActive(direction: Direction): boolean {
        for (const [ key, value ] of this.keyState.entries()) {
            if (!value.active || value.type !== "movement") continue;
            if (this.movementFromKey(key) === direction) return true;
        }

        return false;
    }

    isRotationActive(direction: Direction): boolean {
        for (const [ key, value ] of this.keyState.entries()) {
            if (!value.active || value.type !== "rotation") continue;
            if (this.rotationFromKey(key) === direction) return true;
        }

        return false;
    }

    private handleKeyEvent(pressed: boolean) {
        return (event: KeyboardEvent) => {
            if (event.repeat) return;

            const key = this.keyFromEvent(event);
            const movement = this.movementFromKey(key);
            const rotation = this.rotationFromKey(key);
            if (movement || rotation) {
                console.log(key)
                if (pressed) {
                    this.keyState.set(key, {
                        type: movement ? "movement" : "rotation",
                        frames: 0,
                        active: true,
                        lastEmission: -1,
                    });
                } else {
                    this.keyState.delete(key);
                }
            }
        };
    }

    private movementFromKey(key: string) {
        switch (key) {
            case "ArrowLeft":
                return Direction.LEFT;
            case "ArrowUp":
                return Direction.UP;
            case "ArrowRight":
                return Direction.RIGHT;
            case "ArrowDown":
                return Direction.DOWN;
            default:
                return null;
        }
    }

    private rotationFromKey(key: string) {
        switch (key) {
            case "w":
                return Direction.LEFT;
            case "x":
                return Direction.RIGHT;
            default:
                return null;
        }
    }

    private keyFromEvent(event: KeyboardEvent) {
        return event.key;
    }
}
