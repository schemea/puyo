import { filter } from "rxjs";
import { Message, MessageInterface } from "./message";

export interface BoardMessageInterface extends MessageInterface {
    component: "board";
    player: number;
}

export function forBoard<T extends Message>(player: number) {
    return filter((message: T): message is (T & BoardMessageInterface) => message.component === "board" && message.player === player);
}
