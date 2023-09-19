export interface SquareOptions {
    value: string;
    onSquareClick: Function;
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

export interface GobangDOMInfo extends HTMLDivElement {
    setCurrentMove: (e:number) => void;
}

export interface GobangOptions {
    getGobangInfo: (e: Array<GobangInfo>) => void;
    ref: ChildMethods;
}

export interface GobangInfo {
    row: number;
    col: number;
    chess: boolean;
}

export type ChildMethods = {
    setCurrentMove: (e:number) => void;
}
