import { Matrix } from "./matrix";

function expectMatrix(actual: Matrix) {

    return {
        toHaveDimensions(expectedHeight: number, expectedWidth: number) {
            expect(actual.height).toEqual(expectedHeight);
            expect(actual.width).toEqual(expectedWidth);
        },
        toHaveSameDimensionAs(expected: Matrix) {
            this.toHaveDimensions(expected.height, expected.width);
        },
        toBeCloseTo(expected: Matrix) {
            const p = 10 ** 5;
            const roundedActual = actual.clone();
            const roundedExpected = expected.clone();
            roundedActual.forEach(ref => ref.value = Math.round(ref.value * p) / p);
            roundedExpected.forEach(ref => ref.value = Math.round(ref.value * p) / p);

            expect(roundedActual).toEqual(roundedExpected);
        },
        toEqual(expected: Matrix) {
            expect(actual).toEqual(expected);
        },
    };
}

describe("Matrix", function () {

    describe("multiply", function () {

        it("should be idempotent with identity", function () {
            const matrix = new Matrix(2, 3, [
                1, 2, 3,
                4, 5, 6,
            ]);
            const identity = Matrix.identity(3);

            const result = Matrix.multiply(matrix, identity);

            expectMatrix(result).toEqual(matrix);
        });

        it("should work on 2x3 and 3x1", function () {
            const a = new Matrix(2, 3, [
                1, 2, 3,
                4, 5, 6,
            ]);

            const b = new Matrix(3, 1, [
                7,
                8,
                9,
            ]);

            const result = Matrix.multiply(a, b);
            expectMatrix(result).toEqual(new Matrix(2, 1, [
                50,
                122,
            ]));
        });

        it("should throw on 2x4 and 2x5", function () {
            const a = new Matrix(2, 4);
            const b = new Matrix(2, 5);

            expect(() => Matrix.multiply(a, b)).toThrow("cannot multiply a 2x4 matrix with a 2x5 matrix");
        });
    });

    describe("rotate", function () {

        it("should rotate by 90°", function () {
            const vector = new Matrix(3, 1, [ 5, 5, 1 ]);
            const rotation = Matrix.rotate(Math.PI / 2);

            let result = Matrix.multiply(rotation, vector);
            expectMatrix(result).toBeCloseTo(new Matrix(3, 1, [ 5, -5, 1 ]));

            result = Matrix.multiply(rotation, result);
            expectMatrix(result).toBeCloseTo(new Matrix(3, 1, [ -5, -5, 1 ]));

            result = Matrix.multiply(rotation, rotation, result);
            expectMatrix(result).toBeCloseTo(vector);
        });
    });

    describe("translate", function () {
        it("should translate x and y", function () {
            const vector = new Matrix(3, 1, [ 5, 5, 1 ]);
            const translation = Matrix.translate(2, 3);

            let result = Matrix.multiply(translation, vector);
            expectMatrix(result).toEqual(new Matrix(3, 1, [ 7, 8, 1 ]));

            result = Matrix.multiply(translation, result);
            expectMatrix(result).toEqual(new Matrix(3, 1, [ 9, 11, 1 ]));
        });
    });
});
