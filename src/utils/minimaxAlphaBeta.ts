import { store } from '@/store/index';
import { pointInfo, bestMoveInfo } from '@/interfaces/index';
import { countWinChess } from '@/utils/tool';

const { types, typeIndex } = store.getState().gameSlice;
const { chess, size, win } = types[typeIndex];
const BOARD_SIZE = size;            // 棋盘大小
const [PLAYER_X, PLAYER_O] = chess; // 玩家
const EMPTY_CELL = '-';             // 空格
const ONCE_WIN_TIME = 5;            // 出现落子一次就能赢的条件
const MAX_DEPTH = 3;                // 最大递归深度
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
const boardCount = {                // 玩家局面分数评估
    horizontal: [0, 0, 0], // 水平方向
    vertical: [0, 0, 0],   // 垂直方向
    diagonal: [0, 0],      // 对角线方向
    cornerControl: 0,      // 控制的角落位置
    centerControl: 0,      // 中心位置控制
};
let PLAYER_CURRENT: string;         // 当前玩家类型
let PLAYER_OPPONENT: string;        // 对手玩家类型
interface boardCountInfo {
    score: number;
    counts: typeof boardCount;
}

/**
 * 计算AI的下棋位置
 * @param board 棋盘的点阵图
 * @param isFirstAI AI是否先手
 * @returns 最佳落子坐标
 */
export const makeAIMove = (board: Array<Array<string>>, isFirstAI: boolean): pointInfo => {
    PLAYER_CURRENT = isFirstAI ? PLAYER_O : PLAYER_X;
    PLAYER_OPPONENT = !isFirstAI ? PLAYER_O : PLAYER_X;
    // 如果出现一次就能赢的局面
    const emptyCells = getAvailableMoves(board);
    if (emptyCells.length <= ONCE_WIN_TIME) {
        for (const move of emptyCells) {
            const { row, col } = move;
            board[row][col] = PLAYER_CURRENT;
            if (countWinChess(board, row, col, PLAYER_CURRENT, size, win)) {
                return { row, col };
            }
            board[row][col] = EMPTY_CELL;
        }
    }
    const bestMove = minimax(board, true, -Infinity, Infinity, MAX_DEPTH);
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
export const minimax = (board: Array<Array<string>>, maximizingPlayer: boolean, alpha: number, beta: number, depth: number): bestMoveInfo => {
    // 达到递归最深度，或游戏有一方获胜，或棋盘已满，返回当前局面的评估值
    const emptyCells = getAvailableMoves(board);
    if (depth === 0 || isGameOver(board) || emptyCells.length === 0) {
        return { score: evaluateBoard(board) };
    }

    let bestMove = null;
    if (maximizingPlayer) { // 己方落子环节
        bestMove = { score: -Infinity };
        for (const move of emptyCells) {
            const { row, col } = move;
            board[row][col] = PLAYER_CURRENT;
            const currentMoce = minimax(board, false, alpha, beta, depth - 1);
            board[row][col] = EMPTY_CELL;
            currentMoce.row = row;
            currentMoce.col = col;
            bestMove = currentMoce.score > bestMove.score ? currentMoce : bestMove;
            alpha = Math.max(alpha, bestMove.score);
            if (alpha >= beta) break; // Alpha-Beta剪枝
        }
    } else { // 对方落子环节
        bestMove = { score: Infinity };
        for (const move of emptyCells) {
            const { row, col } = move;
            board[row][col] = PLAYER_OPPONENT;
            const currentMoce = minimax(board, true, alpha, beta, depth - 1);
            board[row][col] = EMPTY_CELL;
            currentMoce.row = row;
            currentMoce.col = col;
            bestMove = currentMoce.score < bestMove.score ? currentMoce : bestMove;
            beta = Math.min(beta, bestMove.score);
            if (alpha >= beta) break; // Alpha-Beta剪枝
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
        if ((playerCurrentPositions & combination) === combination) return PLAYER_CURRENT; // 当前玩家获胜
        else if ((playerOpponentPositions & combination) === combination) return PLAYER_OPPONENT;  // 对手玩家获胜
    }
    return EMPTY_CELL; // 没有胜者
};


/**
 * 为当前玩家进行局面评估（仅适用于井字棋）
 * @param board 棋盘的点阵图
 * @param player 玩家类型
 * @returns 当前玩家局面分数
 */
const countsPlayer = (board: Array<Array<string>>, player: string): boardCountInfo => {
    const counts = JSON.parse(JSON.stringify(boardCount));
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            // 统计当前 player玩家在各行，各列，各对角线，对角以及中心上棋子总数
            if (board[row][col] === player) {
                counts.horizontal[row]++;
                counts.vertical[col]++;
                if (row === col) counts.diagonal[0]++;
                if (row + col === 2) counts.diagonal[1]++;
                if ((row === 0 || row === 2) && (col === 0 || col === 2)) counts.cornerControl++;
                if (row === 1 && col === 1) counts.centerControl++;
            }
        }
    }
    let score = 0; // 计算分数
    // 连线个数得分
    score += counts.horizontal.reduce((acc: number, count: number) => acc + Math.pow(10, count), 0);
    score += counts.vertical.reduce((acc: number, count: number) => acc + Math.pow(10, count), 0);
    score += counts.diagonal.reduce((acc: number, count: number) => acc + Math.pow(10, count), 0);
    score += 5 * counts.cornerControl; // 角落位置控制得分
    score += 10 * counts.centerControl; // 中心位置控制得分
    return { counts, score };
};

/**
 * 判断最大递归数结束时，下一步落子的是己方还是对方；
 *  如是己方且下步就能赢则增加局面分数
 *  如是对方且下步就能赢则减少局面分数
 * @param countsSubArr 己方连子数减去对方连子数形成的数组
 * @returns 增加的局面分数
 */
const nextPlayerIsWin = (countsSubArr: Array<number>): number => {
    if (MAX_DEPTH % 2 === 0 && (countsSubArr.includes(2) || countsSubArr.includes(3))) return 50;
    if (MAX_DEPTH % 2 !== 0 && (countsSubArr.includes(-2) || countsSubArr.includes(-3))) return -50;
    return 0;
};

/**
 * 评估当前局面的得分，估值函数
 * @param board 棋盘的点阵图
 * @returns 当前局面的得分
 */
const evaluateBoard = (board: Array<Array<string>>): number => {
    const { counts: countsCurrent, score: scoreCurrent } = countsPlayer(board, PLAYER_CURRENT);
    const { counts: countsOpponent, score: scoreOpponent } = countsPlayer(board, PLAYER_OPPONENT);

    const countsCurrentArr: Array<string> =
        `${countsCurrent.horizontal.join('')}${countsCurrent.vertical.join('')}${countsCurrent.diagonal.join('')}`.split('');
    const countsOpponentArr: Array<string> =
        `${countsOpponent.horizontal.join('')}${countsOpponent.vertical.join('')}${countsOpponent.diagonal.join('')}`.split('');

    // 将己方棋子统计减去对方棋子统计，得到最终棋盘上连子统计
    const countsSubArr = countsCurrentArr.map((count, index) => {
        return Number(count) - Number(countsOpponentArr[index]);
    });

    const score = scoreCurrent + nextPlayerIsWin(countsSubArr);
    return score - scoreOpponent;
};
