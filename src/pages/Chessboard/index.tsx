import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { GobangMethods, GobangOptions, GobangInfo } from '@/interfaces/index';
import { createTargetArr, countUpDownChess } from '@/utils/tool';
import Square from '@/components/Square';
import './index.css';

/**
 * 棋盘组件
 */
const Chessboard = forwardRef<GobangMethods, GobangOptions>((props, ref) => {
    const { gameType, getGobangInfo } = props;
    const { size, chess, win } = gameType;
    const border = Array(size).fill(null);

    // 游戏结束状态
    const [isOver, setIsOver] = useState<boolean>(false);

    // 当前棋盘上所有落子形成的集合，包含每个落子的横纵坐标和类型
    const [playArr, setplayArr] = useState<Array<GobangInfo>>([]);

    // 用于棋盘上展示的落子的集合
    const [showArr, setShowArr] = useState<Array<GobangInfo>>([]);

    // 当前进行的历史状态索引
    const [currentMove, setCurrentMove] = useState<number>(0);

    // 记录当前棋盘上落子的点阵图
    const [chessArr, setChessArr] = useState<Array<Array<GobangInfo>>>(createTargetArr(size));

    // 记录当前落子的类型
    let xIsNext: boolean = currentMove % 2 === 0;

    useEffect(() => {
        getGobangInfo(playArr);
    }, [playArr]);

    // 游戏类型更换，重置数据源
    useEffect(() => {
        setIsOver(false);
        setShowArr([]);
        setplayArr([]);
        setCurrentMove(0);
        setChessArr(createTargetArr(size));
    }, [size]);


    /**
     * 步骤回退
     * @param move 回退的步骤数
     */
    const rollbackProcess = (move: number) => {
        setCurrentMove(move);
        const newshowArr = [...playArr.slice(0, move)];
        const showArrEnd = newshowArr[newshowArr.length - 1];
        xIsNext = (newshowArr.length - 1) % 2 === 0;
        setShowArr(newshowArr);
        // 如果回退到最新的一步，才判断是否有胜者出现
        if (move === playArr.length && getWinner(newshowArr, xIsNext, chessArr, showArrEnd.row, showArrEnd.col)) {
            setIsOver(true);
        } else {
            setIsOver(false);
        }
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
        const newplayArr = [...playArr.slice(0, currentMove), { row, col, chess: xIsNext }];
        setplayArr(newplayArr);
        setShowArr(newplayArr);
        setCurrentMove(newplayArr.length);
        getGobangInfo(newplayArr);
        if (getWinner(newplayArr, xIsNext, chessArr, row, col)) {
            setIsOver(true);
        }
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
    const getWinner = (playArr: Array<GobangInfo>, chess: boolean, chessArr: Array<Array<GobangInfo>>, row: number, col: number) => {
        setChessArr(createTargetArr(size));
        playArr.map((item) => {
            chessArr[item.row][item.col] = { ...item };
        });
        // 分别对 上下，左右，左斜，右斜 方向进行判断是否产生胜者
        return countUpDownChess(chessArr, row, col, chess, [0, 1], size, win) ||
               countUpDownChess(chessArr, row, col, chess, [1, 0], size, win) ||
               countUpDownChess(chessArr, row, col, chess, [1, 1], size, win) ||
               countUpDownChess(chessArr, row, col, chess, [-1, 1], size, win);
    };

    useImperativeHandle(ref, () => {
        // 暴露给父组件的方法
        return { setCurrentMove: rollbackProcess };
    });

    return (
        <div className="chessboard-wrapper">
            <p className="chessboard-title">
                {isOver ? `Winner: ${chess[Number(!xIsNext)]}` : `Next player: ${chess[Number(xIsNext)]}`}
            </p>
            <div className="chessboard">
                {border.map((_item, rowIndex) => (
                    <div className="chessboard-row" key={`row + ${rowIndex}`}>
                        {border.map((_item, colIndex) => (
                            <div className="chessboard-col" key={`col + ${colIndex}`}>
                                <div className="chessboard-cell">
                                    {
                                        showArr.find(item => item.row === rowIndex && item.col === colIndex)
                                            ? <Square showArr={showArr} value={chess} row={rowIndex} col={colIndex}/>
                                            : <div className="chessboard-cell-click" onClick={() => play(rowIndex, colIndex)} />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Chessboard;
