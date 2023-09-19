export interface SquareOptions {
    value: Array<string>;
    chessType: boolean;
}
export interface ChessInfo {
    row: number;
    col: number;
    chess: boolean;
}
export interface GameType {
    size: number;
    chess: Array<string>;
    win: number;
}
export interface HistoryInfo {
    historyResult: boolean;
    historyArr: Array<ChessInfo>;
    historyMove: number;
}
export interface CounterState {
    types: Array<GameType>;
    typeIndex: number;
    history: Array<HistoryInfo>;
}
export interface ProcessProps {
    showArrLength: number;
    rollbackMove: number;
    onSetProps: (e: number | boolean, l: string) => void;
}
export interface ChessboardProps {
    isRollback: boolean;
    rollbackMove: number;
    onSetProps: (e: number | boolean, l: string) => void;
}

export interface ProcessbuttonProps {
    description: string;
    currentMove: number;
    move: number;
    rollbackClick: (e: number) => void;
}
