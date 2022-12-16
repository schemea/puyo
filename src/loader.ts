import { SpriteSheet } from "./spritesheet";

export interface Assets {
    aqua: SpriteSheet;
}

export const Assets = {} as Assets;

export interface Ruleset {
    chainPower: number[] | Record<string, number[]>;
    colorBonus: number[];
    groupBonus: number[];
}

export const Rulesets = {} as {
    classic: Ruleset
    fever: Ruleset
    [k: string]: Ruleset
};

function loadJSON(url: string) {
    return new Promise<Ruleset>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "json";
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = reject;
        xhr.send();
    });
}

export function loadResources() {
    return Promise.all([
        SpriteSheet.load("assets/images/aqua.png").then(sheet => Assets.aqua = sheet),
        loadJSON("rulesets/classic.json").then(json => Rulesets.classic = json),
        loadJSON("rulesets/fever.json").then(json => Rulesets.fever = json),
    ]);
}
