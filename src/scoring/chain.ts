import { getChainPower } from "./rulesets";
import { Rulesets } from "../loader";

function getValueOrLast<T>(arr: T[], index: number) {
    return index < arr.length ? arr[index] : arr[arr.length - 1];
}

export class ChainEngine {
    readonly chainPower: number[];
    readonly colorBonus: number[];
    readonly groupBonus: number[];
    overallScore = 0;
    chain = 1;

    get nuisances() {
        return this.overallScore / 70;
    }

    constructor(readonly ruleset: string, readonly character: string) {
        this.chainPower = getChainPower(ruleset, character);
        this.colorBonus = Rulesets[ruleset].colorBonus;
        this.groupBonus = Rulesets[ruleset].groupBonus;
    }

    reset() {
        this.overallScore = 0;
        this.chain = 1;
    }

    next(puyo: number, colors: number, groups: number[]) {
        const puyoScore = 10 * puyo;
        let multiplier = this.getCurrentChainPower() + this.getColorBonus(colors) + this.getGroupBonus(groups);
        multiplier = Math.max(1, Math.min(multiplier, 999));
        this.overallScore += puyoScore * multiplier;

        this.chain++;

        return { score: puyoScore, multiplier };
    }

    private getCurrentChainPower() {
        return getValueOrLast(this.chainPower, this.chain - 1);
    }

    private getColorBonus(colors: number) {
        return getValueOrLast(this.colorBonus, colors - 1);
    }

    private getGroupBonus(puyoPerGroup: number[]) {
        return puyoPerGroup
            .map(value => value - 4)
            .map(index => getValueOrLast(this.groupBonus, index))
            .reduce((a, b) => a + b, 0);
    }
}
