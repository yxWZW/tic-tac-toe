import { useEffect, useState } from 'react';
import { GobangInfo } from '@/interfaces/index';
import { createTargetArr, countUpDownChess } from '@/utils/tool';

export default (getGobangInfo: Function) => {
    // 记录下次落子的提示语
    const [status, setStatus] = useState('Next player: 黑棋');

    // 游戏结束状态
    const [isOver, setIsOver] = useState(false);

    // 当前棋盘上所有落子形成的集合，包含每个落子的横纵坐标和类型
    const [playArr, setplayArr] = useState([{}]);

    // 用于棋盘上展示的落子的集合
    const [showArr, setShowArr] = useState<Array<GobangInfo>>(playArr.slice(1) as Array<GobangInfo>);

    // 当前进行的历史状态索引
    const [currentMove, setCurrentMove] = useState(0);

    // 记录当前棋盘上落子的点阵图
    const [chessArr, setChessArr] = useState<Array<Array<GobangInfo>>>(createTargetArr());

    // 记录当前落子的类型（1为黑子，2为白子）
    let xIsNext = currentMove % 2 === 0;

    useEffect(() => {
        getGobangInfo(playArr);
    }, []);

    /**
     * 步骤回退
     * @param move 回退的步骤数
     */
    const rollbackProcess = (move: number) => {
        setCurrentMove(move);
        const newshowArr = [...playArr.slice(0, move + 1)] as Array<GobangInfo>;
        setShowArr(newshowArr.slice(1));
        setStatus(`Next player: ${move % 2 === 1 ? '白棋' : '黑棋'}`);
        setIsOver(false);
    };

    /**
     * 落子触发的事件
     * @param row 落子的横坐标
     * @param col 落子的纵坐标
     */
    const play = (row: number, col: number) => {
        if (isOver) {
            return;
        }
        const newplayArr = [...playArr.slice(0, currentMove + 1), { row, col, chess: xIsNext }] as Array<GobangInfo>;
        setplayArr(newplayArr);
        setShowArr(newplayArr.slice(1));
        if (getWinner(newplayArr.slice(1), xIsNext, chessArr, row, col)) {
            setIsOver(true);
            setStatus(`Winner: ${xIsNext ? '黑棋' : '白棋'}`);
        } else {
            setStatus(`Next player: ${xIsNext ? '白棋' : '黑棋'}`);
        }
        setCurrentMove(newplayArr.length - 1);
        getGobangInfo(newplayArr);
        xIsNext = currentMove % 2 === 0;
    };

    /**
     * 计算胜者
     * @param playArr 当前棋盘中所有落子 坐标信息
     * @param chess 最后一次落子的类型（是黑子还是白子）
     * @param chessArr 当前棋盘上落子的点阵图
     * @param row 最后一次落子的横坐标
     * @param col 最后一次落子的纵坐标
     * @returns 最后一次落子是否产生胜者
     */
    function getWinner (playArr: Array<GobangInfo>, chess: boolean, chessArr: Array<Array<GobangInfo>>, row: number, col: number) {
        setChessArr(createTargetArr());
        playArr.map((item) => {
            chessArr[item.row][item.col] = { ...item };
        });
        // 分别对 上下，左右，左斜，右斜 方向进行判断是否产生胜者
        return countUpDownChess(chessArr, row, col, chess, [0, 1]) ||
               countUpDownChess(chessArr, row, col, chess, [1, 0]) ||
               countUpDownChess(chessArr, row, col, chess, [1, 1]) ||
               countUpDownChess(chessArr, row, col, chess, [-1, 1]);
    }

    return {
        status,
        showArr,
        play,
        rollbackProcess,
    };
};
