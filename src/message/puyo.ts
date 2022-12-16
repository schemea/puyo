import {PointLike} from "../model/point";
import {BoardMessageInterface} from "./board";
import {Color} from "../model/color";

export interface PuyoMessageInterface extends BoardMessageInterface {
    resource: "puyo";

    action: string;
}

export interface PuyoMoveMessage extends PuyoMessageInterface {
    action: "move";
    from: PointLike;
    to: PointLike;
}

export interface PuyoSetMessage extends PuyoMessageInterface {
    action: "set"
    color: Color
    position: PointLike
}

export interface PuyoRemoveMessage extends PuyoMessageInterface {
    action: "remove"
    position: PointLike
}

export type PuyoMessage = PuyoMoveMessage | PuyoSetMessage | PuyoRemoveMessage
