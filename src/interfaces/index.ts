export interface SquareOptions {
    chessType: string;
}
export interface ChessInfo {
    row: number;
    col: number;
    chess: string;
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
export interface GameStateOptions {
    types: Array<GameType>;
    typeIndex: number;
    history: Array<HistoryInfo>;
}
export interface ProcessProps {
    showArrLength: number;
    rollbackMove: number;
    onSetProps: (e: number | boolean, l: string) => void;
}

export interface ProcessState {
    currentMove: number;
}
export interface ChessboardProps {
    historyArr: Array<ChessInfo>;
    historyMove: number;
    historyResult: boolean;
    typeIndex: number;
    size: number;
    chess: Array<string>;
    win: number;
    isRollback: boolean;
    rollbackMove: number;
    isFirstAI: boolean;
    setHistory: (el: gameHistoryInfo) => void;
    onSetProps: (e: number | boolean, l: string) => void;
}

export interface ChessboardState {
    isOver: boolean;
    showArr: Array<ChessInfo>;
    currentMove: number;
    showMap: Map<string, ChessInfo>;
    xIsNext: boolean;
    typeIndex: number;
    isFirstAI: boolean;
}

export interface ProcessbuttonProps {
    description: string;
    rollbackMove: number;
    move: number;
    rollbackClick: (e: number) => void;
}

export interface gameHistoryInfo {
    historyResult: boolean;
    historyArr: Array<ChessInfo>;
    historyMove: number;
}

export interface AppProps {
    typeIndex: number;
    setType: () => void;
}

export interface AppState {
    isFirstAI: boolean;
    isRollback: boolean;
    rollbackMove: number;
    showArrLength: number;
}

export interface pointInfo {
    row: number;
    col: number;
}

export interface bestMoveInfo {
    row?: number;
    col?: number;
    score: number;
}
