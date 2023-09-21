import { SquareOptions } from '@/interfaces';
import './index.css';

/**
 * 棋盘布局单元组件
 * @param value 棋子类别
 * @param onSquareClick 落子事件
 * @param row 落子的横坐标
 * @param row 落子的纵坐标
 */
const Square = ({ showArr, value, row, col }: SquareOptions) => {
    const chess = value[Number(showArr.find((item) => item.row === row && item.col === col)?.chess)];
    return (
        <div className={`chessboard-cell-${chess}`} />
    );
};

export default Square;
