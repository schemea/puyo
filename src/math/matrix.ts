import { PropertyReference, Reference } from "../reference";

export class Matrix {

    constructor(
        readonly height: number, readonly width: number,
        readonly data: number[] = new Array(width * height),
    ) {
    }

    reference(i: number, j: number) {
        return new PropertyReference(this.data, i * this.width + j);
    }

    get(i: number, j: number) {
        return this.reference(i, j).value;
    }

    set(i: number, j: number, value: number) {
        this.reference(i, j).value = value;
    }

    clone() {
        return new Matrix(this.height, this.width, [ ...this.data ]);
    }

    forEach(callback: (ref: Reference<number>, i: number, j: number) => void) {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                callback(this.reference(i, j), i, j);
            }
        }
    }

    static equals(a: Matrix, b: Matrix) {
        if (a.width !== b.width && a.height !== b.height) return false;

        for (let i = 0; i < a.width * a.height; i++) {
            if (a.data[i] !== b.data[i]) return false;
        }

        return true;
    }

    static identity(size: number) {
        const matrix = new Matrix(size, size);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                matrix.set(i, j, i === j ? 1 : 0);
            }
        }

        return matrix;
    }

    static multiply(...args: Matrix[]) {
        let result = args[0].clone();

        for (let i = 1; i < args.length; i++) {
            const factor = args[i];
            if (result.width !== factor.height) {
                throw new Error(`cannot multiply a ${ result.height }x${ result.width } matrix with a ${ factor.height }x${ factor.width } matrix`);
            }

            const tmp = new Matrix(result.height, factor.width);

            function multiplyCell(i: number, j: number) {
                let value = 0;
                for (let k = 0; k < result.width; k++) {
                    value += result.get(i, k) * factor.get(k, j);
                }
                return value;
            }

            for (let i = 0; i < tmp.height; i++) {
                for (let j = 0; j < tmp.width; j++) {
                    tmp.set(i, j, multiplyCell(i, j));
                }
            }

            result = tmp;
        }


        return result;
    }

    static add(...args: Matrix[]) {
        const result = args[0].clone();

        for (let n = 1; n < args.length; n++) {
            const value = args[n];

            if (result.width !== value.width || result.height !== value.height) {
                throw new Error(`cannot add a ${ result.height }x${ result.width } matrix with a ${ value.height }x${ value.width } matrix`);
            }

            for (let i = 0; i < result.data.length; i++) {
                result.data[i] += value.data[i];
            }
        }

        return result;
    }

    static rotate(radian: number) {
        return new Matrix(3, 3, [
            Math.cos(radian), Math.sin(radian), 0,
            -Math.sin(radian), Math.cos(radian), 0,
            0, 0, 1,
        ]);
    }

    static translate(x: number, y: number) {
        return new Matrix(3, 3, [
            1, 0, x,
            0, 1, y,
            0, 0, 1,
        ]);
    }
}
