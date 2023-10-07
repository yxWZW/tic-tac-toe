import { store } from '@/store/index';
import { pointInfo, bestMoveInfo } from '@/interfaces/index';
import { countWinChess } from '@/utils/tool';

const { types, typeIndex } = store.getState().gameSlice;
const { chess, size, win } = types[typeIndex];
const BOARD_SIZE = size;            // 棋盘大小
const [PLAYER_X, PLAYER_O] = chess; // 玩家
const EMPTY_CELL = '-';             // 空格
const ONCE_WIN_TIME = 5;            // 出现落子一次就能赢的条件
const winningCombinations = [       // 出现获胜的可能
    0b111000000, // 水平线 - 第一行
    0b000111000, // 水平线 - 第二行
    0b000000111, // 水平线 - 第三行
    0b100100100, // 垂直线 - 第一列
    0b010010010, // 垂直线 - 第二列
    0b001001001, // 垂直线 - 第三列
    0b100010001, // 对角线 - 左上到右下
    0b001010100,  // 对角线 - 右上到左下
];
let PLAYER_CURRENT: string;         // 当前玩家类型
let PLAYER_OPPONENT: string;        // 对手玩家类型


/**
 * 计算AI的下棋位置
 * @param board 棋盘的点阵图
 * @param isFirstAI AI是否先手
 * @returns 最佳落子坐标
 */
export const makeAIMove = (board: Array<Array<string>>, isFirstAI: boolean): pointInfo => {
    PLAYER_CURRENT = isFirstAI ? PLAYER_X : PLAYER_O;
    PLAYER_OPPONENT = !isFirstAI ? PLAYER_X : PLAYER_O;
    // 如果出现一次就能赢的局面
    const emptyCells = getAvailableMoves(board);
    if (emptyCells.length <= ONCE_WIN_TIME) {
        for (const move of emptyCells) {
            const { row, col } = move;
            board[row][col] = PLAYER_X;
            if (countWinChess(board, row, col, PLAYER_CURRENT, size, win)) {
                return { row, col };
            }
            board[row][col] = EMPTY_CELL;
        }
    }

    const bestMove = minimax(board, isFirstAI, -Infinity, Infinity);
    const { row, col } = bestMove;
    return { row: row as number, col: col as number };
};

/**
 * 极小化极大算法
 * @param board 棋盘的点阵图
 * @param maximizingPlayer 区别当前是 max层还是 min层
 * @param alpha
 * @param beta
 * @param depth 遍历深度
 * @returns 最佳落子位置信息
 */
export const minimax = (board: Array<Array<string>>, maximizingPlayer: boolean, alpha: number, beta: number): bestMoveInfo => {
    // 游戏有一方获胜，或者棋盘已满，返回当前局面的评估值
    const emptyCells = getAvailableMoves(board);
    if (emptyCells.length < ONCE_WIN_TIME && (isGameOver(board) || emptyCells.length === 0)) {
        return { score: evaluateBoard(board) };
    }

    let bestMove = null;
    if (maximizingPlayer) {
        bestMove = { score: -Infinity };
        for (const move of emptyCells) {
            const { row, col } = move;
            board[row][col] = PLAYER_X;
            const currentMoce = minimax(board, false, alpha, beta);
            board[row][col] = EMPTY_CELL;
            currentMoce.row = row;
            currentMoce.col = col;
            bestMove = currentMoce.score > bestMove.score ? currentMoce : bestMove;
            alpha = Math.max(alpha, bestMove.score);
            if (alpha >= beta) {
                break; // Alpha-Beta剪枝
            }
        }
    } else {
        bestMove = { score: Infinity };
        for (const move of emptyCells) {
            const { row, col } = move;
            board[row][col] = PLAYER_O;
            const currentMoce = minimax(board, true, alpha, beta);
            board[row][col] = EMPTY_CELL;
            currentMoce.row = row;
            currentMoce.col = col;
            bestMove = currentMoce.score < bestMove.score ? currentMoce : bestMove;
            beta = Math.min(beta, bestMove.score);
            if (alpha >= beta) {
                break; // Alpha-Beta剪枝
            }
        }
    }
    return bestMove;
};

/**
 * 获取可用的下棋位置
 * @param board 棋盘的点阵图
 * @returns 可下棋位置的集合
 */
export const getAvailableMoves = (board: Array<Array<string>>): Array<pointInfo> => {
    const moves = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === EMPTY_CELL) moves.push({ row, col });
        }
    }
    return moves;
};

/**
 * 判断游戏是否结束
 * @param board 棋盘的点阵图
 * @returns 游戏进行程度
 */
export const isGameOver = (board: Array<Array<string>>): boolean => {
    if (checkWinner(board) === EMPTY_CELL) return false;
    return true;
};

/**
 * 评估当前局面的得分（简单实现）
 * @param board 棋盘的点阵图
 * @returns 当前局面的得分
 */
export const evaluateBoard = (board: Array<Array<string>>): number => {
    if (checkWinner(board) === EMPTY_CELL) return 0;
    return checkWinner(board) === PLAYER_CURRENT ? Infinity : -Infinity;
};

/**
 * 使用位运算法检查胜负（仅适用于井字棋）
 * @param board 棋盘的点阵图
 * @returns 胜负结果
 */
const checkWinner = (board: Array<Array<string>>): string => {
    const boardStr = board.flat().join('');
    const regexPlayerCurrent = new RegExp(`${PLAYER_CURRENT}`, 'g');
    const regexPlayerOpponent = new RegExp(`${PLAYER_OPPONENT}`, 'g');
    const regexEmptyCell = new RegExp(`${EMPTY_CELL}`, 'g');
    // 将玩家的占位转换为二进制位
    const playerCurrentPositions = parseInt(boardStr.
        replace(regexPlayerCurrent, '1').
        replace(regexPlayerOpponent, '0').
        replace(regexEmptyCell, '0'), 2);
    const playerOpponentPositions = parseInt(boardStr.
        replace(regexPlayerOpponent, '1').
        replace(regexPlayerCurrent, '0').
        replace(regexEmptyCell, '0'), 2);

    for (const combination of winningCombinations) {
        if ((playerCurrentPositions & combination) === combination) return PLAYER_X; // 当前玩家获胜
        else if ((playerOpponentPositions & combination) === combination) return PLAYER_O;  // 对手玩家获胜
    }
    return EMPTY_CELL; // 没有胜者
};
