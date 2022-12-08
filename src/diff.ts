export class Diff {

    state = new Map();

    isSame<T>(key: string, value: T) {
        if (this.state.get(key) === value) {
            return true;
        } else {
            this.state.set(key, value);
            return false;
        }
    }

    diffArray<T>(key: string, value: T[]): number[] {
        const old = this.state.get(key) as T[];
        if (old == value) return [];

        const diff = [];
        if (old) {
            for (let i = 0; i < value.length; i++) {
                if (value[i] !== old[i]) diff.push(i);
            }
        } else {
            for (let i = 0; i < value.length; i++) {
                diff.push(i);
            }
        }
        this.state.set(key, value);
        return diff;
    }

    cached<T, R>(key: string, value: T, transform: (value: T) => R) {
        const old = this.state.get(key);

        if (old && old[0] === value) return old[1];
        const transformed = transform(value);
        this.state.set(key, [ value, transformed ]);
        return transformed;
    }
}
