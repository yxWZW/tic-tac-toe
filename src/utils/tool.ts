import { ChessInfo } from '@/interfaces/index';

/**
 * 生成空的二维数组
 * @returns Array 20*20的空字符串数组
 */
export const createTargetArr = (size: number): Array<Array<string>> => {
    const arr = Array(size).fill('-');
    arr.map((__, index) => {
        arr[index] = Array(size).fill('-');
    });
    return arr;
};

/**
 * 将普通 Object对象转化为 Map
 * @param showArr 当前棋盘上棋子的集合
 * @returns Map<string, ChessInfo> Map类型的棋子集合
 */
export const getShowMap = (showArr: Array<ChessInfo>): Map<string, ChessInfo> => {
    const showMap: Map<string, ChessInfo> = new Map();
    showArr.forEach((item: ChessInfo) => {
        showMap.set(`${item.row}-${item.col}`, item);
    });
    return showMap;
};

/**
 * 将落子集合转化为点阵图
 * @param showArr 落子集合
 * @returns Array 点阵图
 */
export const chessboardRender = (showArr: Array<ChessInfo>, size: number): Array<Array<string>> => {
    const newChessArr = createTargetArr(size);
    showArr.forEach((item: ChessInfo) => {
        newChessArr[item.row][item.col] = item.chess;
    });
    return newChessArr;
};

/**
 * 分别对 上下，左右，左斜，右斜 方向进行判断是否产生胜者
 * @param chessArr 棋盘的点阵图
 * @param row 最后一次落子的横坐标
 * @param col 最后一次落子的纵坐标
 * @param chess 后一次落子的类型
 * @param size 棋盘大小
 * @param win 胜利条件
 * @returns Boolean 胜负结果
 */
export const countWinChess = (chessArr: Array<Array<string>>, row: number, col: number, chess: string, size: number, win: number): boolean => {
    const moveSteps = [[0, 1], [1, 0], [1, 1], [-1, 1]];

    /**
     * 计算最后一次落子在某一方向相同类型的棋子形成的子串
     * @param currentRow 当前棋子的横坐标
     * @param currentCol 当前棋子的纵坐标
     * @param rowStep 横轴步进
     * @param colStep 纵轴步进
     * @returns string 连子字符串
     */
    const substringCountWinChess = (currentRow: number, currentCol: number, rowStep: number, colStep: number): string => {
        let substringChess = '';
        for (let xAxis = currentRow, yAxis = currentCol;
            xAxis >= 0 && xAxis < size &&
            yAxis >= 0 && yAxis < size &&
            chessArr[xAxis][yAxis] === chess;
            xAxis += rowStep, yAxis += colStep) {
            substringChess += chessArr[xAxis][yAxis];
        }
        return substringChess;
    };

    /**
     * 计算最后一次落子某一方向是否存在胜利
     * @param rowStep 横轴步进
     * @param colStep 纵轴步进
     * @returns 连子数量
     */
    return moveSteps.some(([rowStep, colStep]) => {
        const resultSub = substringCountWinChess(row + rowStep, col + colStep, rowStep, colStep) +
            substringCountWinChess(row - rowStep, col - colStep, -rowStep, -colStep);
        return resultSub.length >= win - 1;
    });
};
