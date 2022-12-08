export class EventPublisher<Args extends any[] = []> {
    readonly observers: ((...args: Args) => any)[] = [];

    constructor() {}

    subscribe(callback: (...args: Args) => any) {
        this.observers.push(callback);
    }

    remove(callback: (...args: Args) => any) {
        this.observers.splice(this.observers.indexOf(callback), 1);
    }

    emit(...args: Args) {
        for (const observer of this.observers) {
            observer(...args);
        }
    }
}
