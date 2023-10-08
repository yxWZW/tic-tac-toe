import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { setHistory } from '@/store/gameSlice';
import Square from '@/components/Square';
import Title from '@/components/Title';
import { countWinChess, getShowMap, chessboardRender } from '@/utils/tool';
import { ChessboardProps, ChessboardState, gameHistoryInfo, ChessInfo } from '@/interfaces/index';
import { makeAIMove } from '@/utils/minimaxAlphaBeta';
import './index.css';

/**
 * 棋盘组件
 * @param historyArr 游戏历史棋子集合
 * @param historyMove 游戏历史索引
 * @param historyResult 游戏历史胜负
 * @param typeIndex 游戏类型索引
 * @param size 游戏棋盘大小
 * @param chess 游戏棋子种类
 * @param win 游戏获胜条件
 * @param isRollback 当前游戏是否为回退状态
 * @param rollbackMove 当前回退数
 * @param setHistory 修改redux历史记录
 * @param onSetProps 修改父组件数据的方法
 */
class Chessboard extends Component<ChessboardProps, ChessboardState> {
    constructor (props: ChessboardProps) {
        super(props);
        const { historyResult, historyArr, historyMove, typeIndex, isFirstAI } = this.props;
        this.state = {
            isOver: historyResult,
            showArr: historyArr,
            currentMove: historyMove,
            showMap: getShowMap(historyArr),
            xIsNext: historyMove % 2 === 0,
            typeIndex,
            isFirstAI,
        };
    }
    setHistory = this.props.setHistory;
    /**
     * 游戏类型发生变化，重置组件数据源
     */
    static getDerivedStateFromProps (nextProps: ChessboardProps, prevState: ChessboardState) {
        const { typeIndex, historyResult, historyArr, historyMove } = nextProps;
        if (typeIndex !== prevState.typeIndex) {
            return {
                isOver: historyResult,
                showArr: historyArr,
                currentMove: historyMove,
                showMap: getShowMap([...historyArr.slice(0, historyMove)]),
                xIsNext: historyMove % 2 === 0,
                typeIndex,
            };
        }
        return null;
    }

    /**
     * 控制棋盘组件的渲染
     */
    shouldComponentUpdate (nextProps: ChessboardProps) {
        const { rollbackMove, typeIndex, isRollback, isFirstAI } = this.props;
        if (nextProps.rollbackMove !== rollbackMove || nextProps.typeIndex !== typeIndex) return true;
        if (nextProps.isFirstAI !== isFirstAI) return true;
        if (isRollback) return true;
        return false;
    }

    /**
     * 组件更新之后
     */
    componentDidUpdate (prevProps: ChessboardProps, prevState: ChessboardState) {
        const { isRollback, rollbackMove, typeIndex, historyArr, historyMove, isFirstAI, onSetProps } = this.props;
        // 有历史回退，重新渲染棋盘
        if (isRollback && prevProps.rollbackMove !== rollbackMove) {
            this.rollbackProcess(rollbackMove);
        }
        // 游戏类型发生变化，向redux存储游戏历史
        if (prevProps.typeIndex !== typeIndex) {
            this.setHistory({
                historyResult: prevState.isOver,
                historyArr: prevState.showArr,
                historyMove: prevState.currentMove,
            });
            onSetProps(historyArr.length, 'showArrLength');
            onSetProps(historyMove, 'rollbackMove');
            onSetProps(false, 'isRollback');
        }
        // 游戏 AI先手发生变化
        if (prevProps.isFirstAI !== isFirstAI) {
            this.onceFirstPlay();
        }
    }

    /**
     * 步骤回退
     * @param currentMove 回退的步骤数
     */
    rollbackProcess = (currentMove: number): void => {
        const { showArr } = this.state;
        const { chess, onSetProps } = this.props;
        const newShowArr = [...showArr.slice(0, currentMove)];
        const showArrEnd = newShowArr[currentMove - 1];
        this.setState({
            currentMove,
            xIsNext: currentMove % 2 === 0,
            showMap: getShowMap(newShowArr),
        });
        // 如果回退到最新的一步，才判断是否有胜者出现
        if (currentMove === showArr.length &&
            this.getWinner(newShowArr, chess[Number((currentMove - 1) % 2 === 0)], showArrEnd.row, showArrEnd.col)) {
            this.setState({ isOver: true });
        } else {
            this.setState({ isOver: false });
        }
        onSetProps(false, 'isRollback');
    };

    /**
     * 落子触发的事件
     * @param row 落子的横坐标
     * @param col 落子的纵坐标
     */
    play = (row: number, col: number): Array<ChessInfo> | null => {
        const { currentMove, showArr, xIsNext } = this.state;
        const { chess, size, onSetProps } = this.props;
        if (this.state.isOver || currentMove >= size * size) return null;
        const newShowArr = [...showArr.slice(0, currentMove), { row, col, chess: chess[Number(xIsNext)] }];
        this.setState({
            showArr: newShowArr,
            currentMove: newShowArr.length,
            xIsNext: newShowArr.length % 2 === 0,
            showMap: getShowMap(newShowArr),
        });
        onSetProps(false, 'isRollback');
        onSetProps(newShowArr.length, 'showArrLength');
        onSetProps(newShowArr.length, 'rollbackMove');
        if (this.getWinner(newShowArr, chess[Number(xIsNext)], row, col)) {
            this.setState({ isOver: true });
        }
        return newShowArr;
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
    getWinner = (showArr: Array<ChessInfo>, chess: string, row: number, col: number): boolean => {
        const { size, win } = this.props;
        const chessArr = chessboardRender(showArr, size);
        return countWinChess(chessArr, row, col, chess, size, win);
    };

    /**
     * 委托棋盘单元格组件的点击事件
     * @param event 事件对象
     */
    entrustSquareClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        const { typeIndex } = this.props;
        const el = event.target as HTMLButtonElement;
        let showArr: Array<ChessInfo> | null = null;
        if (el.getAttribute('class') === 'chessboard-cell') {
            showArr = this.play(Number(el.getAttribute('chess-row')), Number(el.getAttribute('chess-col')));
        }
        if (showArr && !typeIndex) setTimeout(() => this.playAI(showArr as Array<ChessInfo>), 0);
    };

    /**
     * AI下棋
     * @param showArr 当前棋盘上棋子的集合
     */
    playAI = (showArr: Array<ChessInfo>): void => {
        const { size, isFirstAI } = this.props;
        const board = chessboardRender(showArr, size);
        const { row, col } = makeAIMove(board, isFirstAI);
        this.play(row, col);
    };

    /**
     * 第一次 AI先手执行的函数
     */
    onceFirstPlay = (): void => {
        this.playAI([]);
        this.onceFirstPlay = () => {};
    }

    render (): ReactNode {
        const { size, chess } = this.props;
        const { isOver, showMap, xIsNext, currentMove } = this.state;
        const TitlePropsInfo = { currentMove, xIsNext, isOver, chess, size };
        // console.log('Chessboard渲染了');
        return (
            <div className="chessboard-wrapper">
                <div className="chessboard-title">
                    <Title {...TitlePropsInfo}/>
                </div>
                <div className="chessboard" onClick={this.entrustSquareClick}>
                    {Array.from({ length: size }).map((__, rowIndex) => (
                        <div className="chessboard-row" key={`row_${rowIndex}`}>
                            {Array.from({ length: size }).map((__, colIndex) => (
                                <div className="chessboard-cell" key={`col_${colIndex}`}
                                    chess-row={`${rowIndex}`} chess-col={`${colIndex}`}>
                                    {
                                        showMap.get(`${rowIndex}-${colIndex}`)
                                            ? <Square chessType={showMap.get(`${rowIndex}-${colIndex}`)?.chess as string}/>
                                            : ''
                                    }
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

/**
 * redux中的 state映射到组件的 props
 */
const mapStateToProps = (state: any) => {
    const { history, typeIndex, types } = state.gameSlice;
    const { size, chess, win } = types[typeIndex];
    const { historyArr, historyMove, historyResult } = history[typeIndex];
    return { historyArr, historyMove, historyResult, typeIndex, size, chess, win };
};

/**
 * redux中的 dispatch映射到组件的 props
 */
const mapDispatchToProps = (dispatch: any) => {
    return { setHistory: (el: gameHistoryInfo)  => dispatch(setHistory(el)) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chessboard);
