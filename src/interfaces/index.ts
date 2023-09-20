export interface SquareOptions {
    value: Array<string>;
    showArr: Array<GobangInfo>;
    row: number;
    col: number;
}

export interface BoardOptions {
    xIsNext: boolean;
    squares: Array<string>;
    onPlay: Function;
}

export interface TictactoeOptions {
    history: Array<Array<string>>;
    xIsNext: boolean;
    currentMove: number;
    currentSquares: Array<string>;
    setHistory: Function;
    setCurrentMove: Function;
}

export interface ProcessOptions {
    history: Array<GobangInfo> | Array<Array<string>>;
    setCurrentMove: Function;
}

export interface GobangOptions {
    getGobangInfo: (e: Array<GobangInfo>) => void;
    gameType: GameType;
    ref: GobangMethods;
}

export interface GobangInfo {
    row: number;
    col: number;
    chess: boolean;
}

export type GobangMethods = {
    setCurrentMove: (e:number) => void;
}

export interface GameType {
    size: number;
    chess: Array<string>;
    win: number;
}
