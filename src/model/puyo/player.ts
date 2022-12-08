import { PuyoGrid } from "./grid";

export interface Player {
    character: string
    score: number;
    garbage: number;
    grid: PuyoGrid
}
