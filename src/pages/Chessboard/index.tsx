import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { setHistory } from '@/store/gameSlice';
import Square from '@/components/Square';
import { countWinChess, getShowMap, chessboardRender } from '@/utils/tool';
import { ChessboardProps, ChessboardState, gameHistoryInfo, ChessInfo } from '@/interfaces/index';
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
        this.state = {
            isOver: this.props.historyResult,
            showArr: this.props.historyArr,
            currentMove: this.props.historyMove,
            showMap: getShowMap(this.props.historyArr),
            xIsNext: this.props.historyMove % 2 === 0,
            typeIndex: this.props.typeIndex,
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
        const { rollbackMove, typeIndex, isRollback } = this.props;
        if (nextProps.rollbackMove !== rollbackMove || nextProps.typeIndex !== typeIndex) return true;
        if (isRollback) return true;
        return false;
    }

    /**
     * 组件更新之后
     */
    componentDidUpdate (prevProps: ChessboardProps, prevState: ChessboardState) {
        const { isRollback, rollbackMove, typeIndex, historyArr, historyMove, onSetProps } = this.props;
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
    }

    /**
     * 步骤回退
     * @param currentMove 回退的步骤数
     */
    rollbackProcess = (currentMove: number) => {
        const { showArr } = this.state;
        const { onSetProps } = this.props;
        const newShowArr = [...showArr.slice(0, currentMove)];
        const showArrEnd = newShowArr[currentMove - 1];
        this.setState({
            currentMove,
            xIsNext: currentMove % 2 === 0,
            showMap: getShowMap(newShowArr),
        });
        // 如果回退到最新的一步，才判断是否有胜者出现
        if (currentMove === showArr.length && this.getWinner(newShowArr, (currentMove - 1) % 2 === 0, showArrEnd.row, showArrEnd.col)) {
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
    play = (row: number, col: number) => {
        if (this.state.isOver) return;
        const { currentMove, showArr, xIsNext } = this.state;
        const { onSetProps } = this.props;
        onSetProps(false, 'isRollback');
        const newShowArr = [...showArr.slice(0, currentMove), { row, col, chess: xIsNext }];
        this.setState({
            showArr: newShowArr,
            currentMove: newShowArr.length,
            xIsNext: newShowArr.length % 2 === 0,
            showMap: getShowMap(newShowArr),
        });
        onSetProps(newShowArr.length, 'showArrLength');
        onSetProps(newShowArr.length, 'rollbackMove');
        if (this.getWinner(newShowArr, xIsNext, row, col)) {
            this.setState({ isOver: true });
        }
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
    getWinner = (showArr: Array<ChessInfo>, chess: boolean, row: number, col: number): boolean => {
        const { size, win } = this.props;
        const chessArr = chessboardRender(showArr, size);
        return countWinChess(chessArr, row, col, chess, size, win);
    };

    /**
     * 委托棋盘单元格组件的点击事件
     * @param event 事件对象
     */
    entrustSquareClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const el = event.target as HTMLButtonElement;
        if (el.getAttribute('class') === 'chessboard-cell') {
            this.play(Number(el.getAttribute('chess-row')), Number(el.getAttribute('chess-col')));
        }
    };

    /**
     * 计算当前游戏进度标题
     * @returns string 游戏进度标题
     */
    playingTitles = (): string => {
        const { currentMove, xIsNext, isOver } = this.state;
        const { chess, size } = this.props;
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

    render (): ReactNode {
        const { size, chess } = this.props;
        const { showMap } = this.state;
        // console.log('Chessboard渲染了');
        return (
            <div className="chessboard-wrapper">
                <p className="chessboard-title">
                    { this.playingTitles() }
                </p>
                <div className="chessboard" onClick={this.entrustSquareClick}>
                    {Array.from({ length: size }).map((__, rowIndex) => (
                        <div className="chessboard-row" key={`row_${rowIndex}`}>
                            {Array.from({ length: size }).map((__, colIndex) => (
                                <div className="chessboard-cell" key={`col_${colIndex}`}
                                    chess-row={`${rowIndex}`} chess-col={`${colIndex}`}>
                                    {
                                        showMap.get(`${rowIndex}-${colIndex}`)
                                            ? <Square
                                                chessType={showMap.get(`${rowIndex}-${colIndex}`)?.chess as boolean}
                                                value={chess} />
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
