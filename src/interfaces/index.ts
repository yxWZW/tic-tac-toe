export interface SquareOptions {
    value: Array<string>;
    showArr: Array<chessInfo>;
    row: number;
    col: number;
}

export interface ProcessProps {
    setCurrentMove: Function;
    playArr: Array<chessInfo>;
    isRollback: boolean;
    setIsRollback: (e: boolean) => void;
}

export interface chessInfo {
    row: number;
    col: number;
    chess: boolean;
}

export interface GameType {
    size: number;
    chess: Array<string>;
    win: number;
}

export interface GameStateOptions {
    types: Array<GameType>;
    typeIndex: number;
    playArr: Array<chessInfo>;
    currentMove: number;
}

export interface ChessboardState {
    isOver: boolean;
    xIsNext: boolean;
    showArr: Array<chessInfo>;
    chessArr: Array<Array<chessInfo>>;
}

export interface ChessboardProps {
    currentMove: number;
    typeIndex: number;
    playArr: Array<chessInfo>;
    size: number;
    win: number;
    chess: Array<string>;
    isRollback: boolean;
    setPlayArr: (e: Array<chessInfo>) => void;
    setCurrentMove: (e: number) => void;
    setIsRollback: (e: boolean) => void;
}

export interface ChessboardRefs {
    rollbackProcess: (e: number) => void;
}

export interface AppProps {
    typeIndex: number;
    setType: () => void;
}

export interface AppState {
    isRollback: boolean;
}

