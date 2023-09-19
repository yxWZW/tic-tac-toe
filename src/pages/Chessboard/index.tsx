import { memo, useEffect, useState } from 'react';
import { ChessboardProps, ChessInfo } from '@/interfaces/index';
import { chessboardRender, countWinChess, getShowMap } from '@/utils/tool';
import { useAppSelector, useAppDispatch } from '@/interfaces/hooks';
import { setHistory } from '@/store/gameSlice';
import Square from '@/components/Square';
import './index.css';

/**
 * 棋盘组件
 * @param rollbackMove 当前回退数
 * @param isRollback 当前是否处于回退状态
 * @param setIsRollback 修改回退状态
 * @param getShowArrLength 修改当前棋盘上棋子总数
 */
const Chessboard = ((props: ChessboardProps) => {
    const { rollbackMove, isRollback, onSetProps } = props;
    const gameState = useAppSelector((state) => state.gameSlice);
    const dispatch = useAppDispatch();

    const { history, typeIndex, types } = gameState;
    const { size, chess, win } = types[typeIndex];
    const { historyArr, historyMove, historyResult } = history[typeIndex];

    // 游戏结束状态
    const [isOver, setIsOver] = useState<boolean>(historyResult);
    // 用于棋盘上展示的落子集合
    const [showArr, setShowArr] = useState<Array<ChessInfo>>(historyArr);
    // 当前进行的历史索引
    const [currentMove, setCurrentMove] = useState<number>(historyMove);
    // Map对象，用于更快的查询棋子对象信息
    const [showMap, setShowMap] = useState(getShowMap(historyArr));
    // 棋子类型
    const [chessTypes, setChessTypes] = useState<Array<string>>(chess);
    // 棋盘规模
    const [boardSize, setBoardSize] = useState<number>(size);
    // 记录当前落子的类型
    let xIsNext: boolean = currentMove % 2 === 0;

    // 有历史回退，更改历史索引
    useEffect(() => {
        if (rollbackMove > -1) setCurrentMove(rollbackMove);
    }, [rollbackMove]);

    // 历史索引发生变化，更新页面
    useEffect(() => {
        xIsNext = currentMove % 2 === 0;
        if (currentMove) onSetProps(currentMove, 'rollbackMove');
        if (isRollback) rollbackProcess(currentMove);
    }, [currentMove]);

    // 游戏类型更换，向仓库提交数据，重置数据源
    useEffect(() => {
        setBoardSize(size);
        setChessTypes(chess);
        setShowMap(getShowMap([...historyArr.slice(0, historyMove)]));
        setIsOver(historyResult);
        setShowArr(historyArr);
        setCurrentMove(historyMove);
        onSetProps(historyMove, 'rollbackMove');
        onSetProps(historyArr.length, 'showArrLength');
        dispatch(setHistory({ showArr, currentMove, isOver }));
    }, [typeIndex]);

    /**
     * 步骤回退
     * @param currentMove 回退的步骤数
     */
    const rollbackProcess = (currentMove: number) => {
        const newshowArr = [...showArr.slice(0, currentMove)];
        setShowMap(getShowMap(newshowArr));
        const showArrEnd = newshowArr[currentMove - 1];
        xIsNext = (currentMove - 1) % 2 === 0;
        // 如果回退到最新的一步，才判断是否有胜者出现
        if (currentMove === showArr.length && getWinner(newshowArr, xIsNext, showArrEnd?.row, showArrEnd?.col)) {
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
        onSetProps(false, 'isRollback');
        if (isOver) return;
        const newshowArr = [...showArr.slice(0, currentMove), { row, col, chess: xIsNext }];
        setShowArr(newshowArr);
        setCurrentMove(newshowArr.length);
        onSetProps(newshowArr.length, 'showArrLength');
        setShowMap(getShowMap(newshowArr));
        if (getWinner(newshowArr, xIsNext, row, col)) setIsOver(true);
    };

    /**
     * 计算胜者
     * @param showArr 当前棋盘中所有落子 坐标信息
     * @param chess 最后一次落子的类型（是黑子还是白子）
     * @param chessArr 当前棋盘上落子的点阵图
     * @param row 最后一次落子的横坐标
     * @param col 最后一次落子的纵坐标
     * @returns boolean 最后一次落子是否产生胜者
     */
    const getWinner = (showArr: Array<ChessInfo>, chess: boolean, row: number, col: number): boolean => {
        const chessArr = chessboardRender(showArr, size);
        return countWinChess(chessArr, row, col, chess, size, win);
    };

    /**
     * 委托棋盘单元格组件的点击事件
     * @param event 事件对象
     */
    const entrustSquareClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const el = event.target as HTMLButtonElement;
        if (el.getAttribute('class') === 'chessboard-cell') {
            play(Number(el.getAttribute('chess-row')), Number(el.getAttribute('chess-col')));
        }
    };

    /**
     * 计算当前游戏进度标题
     * @returns string 游戏进度标题
     */
    const playingTitles = () => {
        let title = '';
        if (isOver) {
            title = `Winner: ${chess[Number(!xIsNext)]}`;
        } else if (currentMove !== size * size && !isOver) {
            title = `Next player: ${chess[Number(xIsNext)]}`;
        } else  {
            title = 'A dead heat';
        }
        return title;
    };

    return (
        <div className="chessboard-wrapper">
            <p className="chessboard-title">
                { playingTitles() }
            </p>
            <div className="chessboard" onClick={entrustSquareClick}>
                {Array.from({ length: boardSize }).map((__, rowIndex) => (
                    <div className="chessboard-row" key={`row_${rowIndex}`}>
                        {Array.from({ length: boardSize }).map((__, colIndex) => (
                            <div className="chessboard-cell" key={`col_${colIndex}`}
                                chess-row={`${rowIndex}`} chess-col={`${colIndex}`}>
                                {
                                    showMap.get(`${rowIndex}-${colIndex}`)
                                        ? <Square
                                            chessType={showMap.get(`${rowIndex}-${colIndex}`)?.chess as boolean}
                                            value={chessTypes} />
                                        : ''
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default memo(Chessboard);
