import { PointLike } from "../model/point";
import { BoardMessageInterface } from "./board";

export interface PuyoMessageInterface extends BoardMessageInterface {
    resource: "puyo";

    action: string;
}

export interface PuyoMoveMessage extends PuyoMessageInterface {
    action: "move";
    from: PointLike;
    to: PointLike;
}

export type PuyoMessage = PuyoMoveMessage
