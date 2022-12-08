export interface Reference<T> {
    value: T;
}

export class PropertyReference<T, K extends keyof T> implements Reference<T[K]> {
    constructor(readonly target: T, readonly key: K) {}

    get value() {
        return this.target[this.key];
    }

    set value(value) {
        this.target[this.key] = value;
    }
}
