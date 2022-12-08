import { Direction } from "../model/direction";
import { EventPublisher } from "../event";

export interface Events {
    readonly direction: EventPublisher<[ Direction, boolean ]>;
    readonly rotation: EventPublisher<[ Direction, boolean ]>;
}

export interface InputSource {
    readonly events: Events;

    update(elapsed: number): void;

    isDirectionActive(direction: Direction): boolean
}
