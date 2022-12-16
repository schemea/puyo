
export const FPS = 60

export function getFrames(elapsed: number) {
    return elapsed * FPS / 1000;
}

export function getIntFrames(elapsed: number, leftOver: number) {
    const frames = getFrames(elapsed) + leftOver;
    const intFrames = Math.floor(frames);
    return [ intFrames, frames - intFrames ];
}
