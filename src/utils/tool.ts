import { GobangInfo } from '@/interfaces/index';

/**
 * 生成空的二维数组
 * @returns 20*20的空字符串数组
 */
export const createTargetArr = (size: number): Array<Array<string>> => {
    const arr = Array(size).fill('');
    arr.map((_item, index) => {
        arr[index] = Array(size).fill('');
    });
    return arr;
};

/**
 * 分别对 上下，左右，左斜，右斜 方向进行判断是否产生胜者
 * @param chessArr 棋盘的点阵图
 * @param row 最后一次落子的横坐标
 * @param col 最后一次落子的纵坐标
 * @param chess 后一次落子的类型
 * @param size 棋盘大小
 * @param win 胜利条件
 * @returns 胜负结果
 */
export const countWinChess = (chessArr: Array<Array<GobangInfo>>, row: number, col: number, chess: boolean, size: number, win: number): boolean => {
    const moveSteps = [[0, 1], [1, 0], [1, 1], [-1, 1]];

    /**
     * 递归遍历最后一次落子某一方向是否存在相同类型的棋子
     * @param current_row 当前棋子的横坐标
     * @param current_col 当前棋子的纵坐标
     * @param row_step 横轴步进
     * @param col_step 纵轴步进
     * @returns 连子数量
     */
    const deepCountWinChess = (current_row: number, current_col: number, row_step: number, col_step: number): number => {
        if (current_row >= 0 && current_row < size &&
            current_col >= 0 && current_col < size &&
            chessArr[current_row][current_col].chess === chess) {
            return 1 + deepCountWinChess(current_row + row_step, current_col + col_step, row_step, col_step);
        }
        return 0;
    };

    /**
     * 计算最后一次落子某一方向是否存在胜利
     * @param row_step 横轴步进
     * @param col_step 纵轴步进
     * @returns 连子数量
     */
    return moveSteps.some(([row_step, col_step]) => {
        let count = 1;
        count += deepCountWinChess(row + row_step, col + col_step, row_step, col_step) +
            deepCountWinChess(row - row_step, col - col_step, -row_step, -col_step);
        return count >= win;
    });
};
