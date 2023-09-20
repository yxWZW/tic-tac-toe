import { GobangInfo } from '@/interfaces/index';

/**
 * 生成空的二维数组
 * @returns 20*20的空字符串数组
 */
export const createTargetArr = () => {
    const arr = Array(20).fill('');
    arr.map((_item, index) => {
        arr[index] = Array(20).fill('');
    });
    return arr;
};

/**
 * 计算胜者
 * @param chessArr 棋盘的点阵图
 * @param row 最后一次落子的横坐标
 * @param col 最后一次落子的纵坐标
 * @param chess 后一次落子的类型
 * @param moveType 移动步进
 * @returns 胜负结果
 */
export const countUpDownChess = (chessArr: Array<Array<GobangInfo>>, row: number, col: number, chess: boolean, moveStep: Array<number>) => {
    let count = 0;
    const [row_step, col_step] = [...moveStep];
    // 正方向
    for (let num_i = row + row_step, num_j = col + col_step;
        num_i >= 0 && num_i < 20 && num_j >= 0 && num_j < 20;
        num_i += row_step, num_j += col_step) {
        if (chessArr[num_i][num_j].chess !== chess) break;
        count++;
    }
    // 反方向
    for (let num_i = row - row_step, num_j = col - col_step;
        num_i >= 0 && num_i < 20 && num_j >= 0 && num_j < 20;
        num_i -= row_step, num_j -= col_step) {
        if (chessArr[num_i][num_j].chess !== chess) break;
        count++;
    }
    if (count >= 4) {
        count = 0;
        return true;
    }
    return false;
};
