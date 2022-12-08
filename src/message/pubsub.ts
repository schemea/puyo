import { Message, MessageInterface } from "./message";
import { Observable, Subject } from "rxjs";

interface UnaryFunction<T, R> {
    (source: T): R;
}

interface OperatorFunction<T, R> extends UnaryFunction<Observable<T>, Observable<R>> {}

export class MessagePubsub<T extends MessageInterface = Message> {

    private readonly subject = new Subject<MessageInterface>();

    private constructor(readonly observable: Observable<T>) {
    }

    static create() {
        return Object.create(MessagePubsub.prototype, {
            subject: { value: new Subject(), writable: false },
            observable: { get() {return this.subject.asObservable();} },
        });
    }

    pipe(): MessagePubsub<T>;
    pipe<A extends MessageInterface>(op1: OperatorFunction<T, A>): MessagePubsub<A>;
    pipe<A, B extends MessageInterface>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): MessagePubsub<B>;
    pipe<A, B, C extends MessageInterface>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): MessagePubsub<C>;
    pipe<A, B, C, D extends MessageInterface>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): MessagePubsub<D>;
    pipe<A, B, C, D, E extends MessageInterface>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>, op5: OperatorFunction<D, E>): MessagePubsub<E>;
    pipe(...args: any[]) {
        // @ts-ignore
        const observable: Observable<any> = this.observable.pipe(...args);
        return new MessagePubsub(observable);
    }

    subscribe(callback: (message: T) => void) {
        return this.observable.subscribe(callback);
    }

    publish(message: T) {
        this.subject.next(message);
    }
}
