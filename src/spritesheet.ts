import { Area } from "./model/area";

export class Sprite {
    constructor(readonly image: CanvasImageSource, readonly area: Area) {}
}

export class SpriteSheet {
    constructor(readonly image: CanvasImageSource) {

    }

    get(area: Area) {
        return new Sprite(this.image, area);
    }

    static load(url: string) {
        return new Promise<SpriteSheet>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(new SpriteSheet(img));
            img.onerror = reject;
            img.src = url;
        });
    }
}
