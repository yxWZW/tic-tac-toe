import { SquareOptions, BoardOptions, TictactoeOptions } from '@/interfaces';
import './index.css';

/**
 * 棋盘布局单元组件
 * @param value 棋子类别
 * @param onSquareClick 落子事件
 */
function Square ({ value, onSquareClick }: SquareOptions) {
    return (
        <button className="square" onClick={() => onSquareClick()}>
            {value}
        </button>
    );
}


/**
 * 棋盘组件
 * @param xIsNext 判断下一步落子的类型
 * @param squares 当前棋盘状态
 */
function Board ({ xIsNext, squares, onPlay }: BoardOptions) {
    /**
     * 棋盘点击事件
     * @param move 回退步骤数
     */
    function handleClick (move: number) {
        if (calculateWinner(squares) || squares[move]) {
            return;
        }
        const nextSquares = [...squares];
        nextSquares[move] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else {
        status = `Next player: ${xIsNext ? 'X' : 'O'}`;
    }

    return (
        <div>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </div>
    );
}


/**
 * 计算胜者
 * @param squares 当前棋盘布局
 * @returns 最后一次落子是否产生胜者
 */
function calculateWinner (squares: Array<string>) {
    // 记录成功的所有可能
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let num_i = 0; num_i < lines.length; num_i++) {
        const [num_a, num_b, num_c] = lines[num_i];
        if (squares[num_a] && squares[num_a] === squares[num_b] && squares[num_a] === squares[num_c]) {
            return squares[num_a];
        }
    }
    return null;
}


/**
 * 游戏棋盘组件
 * @param history 落子的历史记录
 * @param xIsNext 下一步落子的类型
 * @param currentMove 历史状态索引
 * @param currentSquares 当前棋盘布局
 * @param setHistory 设置历史记录的方法
 * @param setCurrentMove 设置历史状态索引的方法
 * @returns 游戏棋盘组件
 */
const Tictactoe = ({ history, xIsNext, currentMove, currentSquares, setHistory, setCurrentMove }: TictactoeOptions) => {
    /**
     * 记录回退事件
     * @param nextSquares 最近一次棋盘布局
     */
    function handlePlay (nextSquares: Array<string>) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    return (
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
    );
};

export default Tictactoe;
