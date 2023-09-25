import { Component, ReactNode } from 'react';
import { createTargetArr, countWinChess } from '@/utils/tool';
import { setPlayArr, setCurrentMove } from '@/store/gameSlice';
import { chessInfo, ChessboardState, ChessboardProps, ChessboardRefs } from '@/interfaces/index';
import Square from '@/components/Square';
import { connect } from 'react-redux';
import './index.css';

/**
 * 棋盘组件
 */
class Chessboard extends Component<ChessboardProps, ChessboardState, ChessboardRefs> {
    constructor (props: ChessboardProps) {
        super(props);
        this.state = {
            isOver: false,                              // 游戏结束状态
            showArr: [],                                // 用于棋盘上展示的落子的集合
            chessArr: createTargetArr(this.props.size), // 记录当前棋盘上落子的点阵图
            xIsNext: this.props.currentMove % 2 === 0,  // 记录当前落子的类型
        };
    }
    setPlayArr = this.props.setPlayArr;
    setCurrentMove = this.props.setCurrentMove;

    /**
     * @param _prevProps
     * @param prevState
     */
    componentDidUpdate (prevProps: ChessboardProps) {
        // currentMove 发生变化，重新渲染棋盘
        if (prevProps.currentMove !== this.props.currentMove) {
            if (this.props.isRollback) {
                this.rollbackProcess(this.props.currentMove);
            }
            this.setState({
                xIsNext: this.props.currentMove  % 2 === 0,
                showArr: [...this.props.playArr.slice(0, this.props.currentMove)],
            });
        }
        // 游戏类型发生变化，重置组件数据源
        if (prevProps.typeIndex !== this.props.typeIndex) {
            this.setState({
                isOver: false,
                showArr: [],
                chessArr: createTargetArr(this.props.size),
            });
            this.setPlayArr([]);
            this.setCurrentMove(0);
        }
    }


    /**
     * 步骤回退
     * @param move 回退的步骤数
     */
    rollbackProcess = (move: number) => {
        const newshowArr = [...this.props.playArr.slice(0, move)];
        const showArrEnd = newshowArr[move - 1];
        this.setState({ xIsNext: (move - 1) % 2 === 0 });
        // 如果回退到最新的一步，才判断是否有胜者出现
        if (move === this.props.playArr.length &&
            this.getWinner(newshowArr, (move - 1) % 2 === 0, this.state.chessArr, showArrEnd.row, showArrEnd.col)) {
            this.setState({ isOver: true });
        } else {
            this.setState({ isOver: false });
        }
    };

    /**
     * 落子触发的事件
     * @param row 落子的横坐标
     * @param col 落子的纵坐标
     */
    play = (row: number, col: number) => {
        this.props.setIsRollback(false);
        if (this.state.isOver) return;
        const newplayArr = [...this.props.playArr.slice(0, this.props.currentMove), { row, col, chess: this.state.xIsNext }];
        this.setPlayArr(newplayArr);
        this.setCurrentMove(newplayArr.length);
        if (this.getWinner(newplayArr, this.state.xIsNext, this.state.chessArr, row, col)) {
            this.setState({ isOver: true });
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
    getWinner = (playArr: Array<chessInfo>, chess: boolean, chessArr: Array<Array<chessInfo>>, row: number, col: number) => {
        this.setState({ chessArr: createTargetArr(this.props.size) });
        playArr.map((item) => {
            chessArr[item.row][item.col] = { ...item };
        });
        return countWinChess(chessArr, row, col, chess, this.props.size, this.props.win);
    };

    render (): ReactNode {
        return (
            <div className="chessboard-wrapper">
                <p className="chessboard-title">
                    {this.state.isOver
                        ? `Winner: ${this.props.chess[Number(!this.state.xIsNext)]}`
                        : `Next player: ${this.props.chess[Number(this.state.xIsNext)]}`}
                </p>
                <div className="chessboard">
                    {Array.from({ length: this.props.size }).map((_item, rowIndex) => (
                        <div className="chessboard-row" key={`row_${rowIndex}`}>
                            {Array.from({ length: this.props.size }).map((_item, colIndex) => (
                                <div className="chessboard-cell" key={`col_${colIndex}`}>
                                    {
                                        this.state.showArr.some(item => item.row === rowIndex && item.col === colIndex)
                                            ? <Square showArr={this.state.showArr} value={this.props.chess} row={rowIndex} col={colIndex}/>
                                            : <div className="chessboard-cell-click" onClick={() => this.play(rowIndex, colIndex)} />
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
 * @param state
 */
const mapStateToProps = (state: any) => {
    const { currentMove, playArr, typeIndex, types } = state.gameSlice;
    const { size, chess, win } = types[typeIndex];
    return { currentMove, playArr, typeIndex, size, chess, win };
};

/**
 * redux中的 dispatch映射到组件的 props
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: any) => {
    return {
        setPlayArr: (arg: Array<chessInfo>)  => dispatch(setPlayArr(arg)),
        setCurrentMove: (arg: number) => dispatch(setCurrentMove(arg)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chessboard);
