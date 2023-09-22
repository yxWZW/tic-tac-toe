import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { GobangMethods, GobangInfo } from '@/interfaces/index';
import { createTargetArr, countWinChess } from '@/utils/tool';
import { useAppSelector, useAppDispatch } from '@/interfaces/hooks';
import { setPlayArr, setCurrentMove } from '@/store/gameSlice';
import Square from '@/components/Square';
import './index.css';

/**
 * 棋盘组件
 */
const Chessboard = forwardRef<GobangMethods>((_props, ref) => {
    const gameState = useAppSelector((state) => state.gameSlice);
    const dispatch = useAppDispatch();
    const { size, chess, win } = gameState.types[gameState.typeIndex];
    const { playArr, currentMove, typeIndex } = gameState;

    // 游戏结束状态
    const [isOver, setIsOver] = useState<boolean>(false);
    // 用于棋盘上展示的落子的集合
    const [showArr, setShowArr] = useState<Array<GobangInfo>>([]);
    // 记录当前棋盘上落子的点阵图
    const [chessArr, setChessArr] = useState<Array<Array<GobangInfo>>>(createTargetArr(size));
    // 记录当前落子的类型
    let xIsNext: boolean = currentMove % 2 === 0;

    // 有落子，更新页面
    useEffect(() => {
        xIsNext = currentMove % 2 === 0;
        setShowArr([...playArr.slice(0, currentMove)]);
    }, [currentMove]);

    // 游戏类型更换，重置数据源
    useEffect(() => {
        setIsOver(false);
        setShowArr([]);
        setChessArr(createTargetArr(size));
        dispatch(setPlayArr([]));
        dispatch(setCurrentMove(0));
    }, [typeIndex]);


    /**
     * 步骤回退
     * @param move 回退的步骤数
     */
    const rollbackProcess = (move: number) => {
        dispatch(setCurrentMove(move));
        const newshowArr = [...playArr.slice(0, move)];
        const showArrEnd = newshowArr[move - 1];
        xIsNext = (move - 1) % 2 === 0;
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
        if (isOver) return;
        const newplayArr = [...playArr.slice(0, currentMove), { row, col, chess: xIsNext }];
        dispatch(setPlayArr(newplayArr));
        dispatch(setCurrentMove(newplayArr.length));
        if (getWinner(newplayArr, xIsNext, chessArr, row, col)) {
            setIsOver(true);
        }
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
        return countWinChess(chessArr, row, col, chess, size, win);
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
                {Array.from({ length: size }).map((_item, rowIndex) => (
                    <div className="chessboard-row" key={`row_${rowIndex}`}>
                        {Array.from({ length: size }).map((_item, colIndex) => (
                            <div className="chessboard-cell" key={`col_${colIndex}`}>
                                {
                                    showArr.some(item => item.row === rowIndex && item.col === colIndex)
                                        ? <Square showArr={showArr} value={chess} row={rowIndex} col={colIndex}/>
                                        : <div className="chessboard-cell-click" onClick={() => play(rowIndex, colIndex)} />
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Chessboard;
