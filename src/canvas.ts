import { Point, PointLike, SizeLike, VectorLike } from "./model/point";

export class RenderTarget {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(readonly container: HTMLElement) {
        this.canvas = container.appendChild(document.createElement("canvas"));
        const context = this.canvas.getContext("2d");

        if (!context) throw new Error("could not obtain rendering context");
        this.context = context;

        this.onResize();
        addEventListener("resize", this.onResize.bind(this));
    }

    onResize() {
        const { width, height } = this.container.getBoundingClientRect();
        this.canvas.width = width;
        this.canvas.height = height;
    }

    translate(vector: VectorLike) {
        this.context.translate(vector.x, vector.y);
    }

    save() {
        this.context.save();
    }

    restore() {
        this.context.restore();
    }

    clear(): void;
    clear(min: PointLike, max: PointLike): void;
    clear(min?: PointLike, max?: PointLike) {
        if (!min) min = new Point();
        if (!max) max = Point.add(min, { x: this.canvas.width, y: this.canvas.height });
        this.context.clearRect(min.x, min.y, max.x - min.x, max.y - min.y);
    }


    drawImage(image: CanvasImageSource): void;
    drawImage(image: CanvasImageSource, position: PointLike): void;
    drawImage(image: CanvasImageSource, position: PointLike, size: SizeLike): void;
    drawImage(image: CanvasImageSource, sourcePosition: PointLike, sourceSize: SizeLike, targetPosition: PointLike, targetSize: SizeLike): void;
    drawImage(image: CanvasImageSource, ...args: PointLike[]) {
        switch (args.length) {
            case 0:
                this.context.drawImage(image, 0, 0);
                break;
            case 1: {
                const [ { x, y } ] = args;
                this.context.drawImage(image, x, y);
                break;
            }
            case 2: {
                const [ position, size ] = args;
                this.context.drawImage(image, position.x, position.y, size.x, size.y);
                break;
            }
            case 4: {
                const [ spos, ssize, dpos, dsize ] = args;
                this.context.drawImage(image, spos.x, spos.y, ssize.x, ssize.y, dpos.x, dpos.y, dsize.x, dsize.y);
                break;
            }
            default:
                throw new Error("invalid number of arguments");
        }
    }

    set fillColor(value: string) {
        this.context.fillStyle = value;
    }

    fillRect(min: PointLike, max: PointLike) {
        const { x: w, y: h } = Point.add(max, Point.negate(min));
        this.context.fillRect(min.x, min.y, w, h);
    }
}
