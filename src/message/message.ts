import { PuyoMessage } from "./puyo";
import { filter } from "rxjs";

export interface MessageInterface {
    component: string;
    resource: string;
}

export type Message = PuyoMessage

export function forResource<T extends Message, Resource extends Message["resource"]>(resource: Resource) {
    return filter((message: T): message is (T & { resource: Resource }) => message.resource === resource);
}

export function forComponent<T extends Message, Component extends Message["component"]>(component: Component) {
    return filter((message: T): message is (T & { component: Component }) => message.component === component);
}
