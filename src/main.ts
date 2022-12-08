import { RenderTarget } from "./canvas";
import { loadResources } from "./loader";
import { PuyoGame } from "./game";
import { KeyboardSource } from "./input/keyboard";
import { MessagePubsub } from "./message/pubsub";

const renderTarget = new RenderTarget(document.body);

let total = 0;

const game = new PuyoGame(MessagePubsub.create(),2);
game.addInputSource(0,new KeyboardSource(renderTarget.container));

function render(newTotal: number) {
    const elapsed = newTotal - total;
    total = newTotal;
    renderTarget.clear();
    game.update(elapsed);
    game.render(renderTarget);
    requestAnimationFrame(render);
}

loadResources().then(() => requestAnimationFrame(render));
