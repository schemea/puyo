import { Rulesets } from "../loader";


export function getChainPower(ruleset: string, character: string): number[] {
    const chainPower = Rulesets[ruleset].chainPower;
    if (chainPower instanceof Array) return chainPower;
    return chainPower[character];
}
