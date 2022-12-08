import { Color } from "../color";

export enum PuyoState {
    INVALID   = 0b00000,
    BLANK     = 0b00001,
    STATIC    = 0b00010,
    ANIMATING = 0b00100,
    FALLING   = 0b01100,

}

export interface Puyo {
    readonly color: Color;
    readonly links: number;
    readonly state: PuyoState;
}
