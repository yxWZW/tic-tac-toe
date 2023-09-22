import { SquareOptions } from '@/interfaces';
import { Component, ReactNode } from 'react';
import './index.css';

/**
 * 棋盘布局单元组件
 * @param value 棋子类别
 * @param onSquareClick 落子事件
 * @param row 落子的横坐标
 * @param row 落子的纵坐标
 */
class Square extends Component<SquareOptions> {
    render (): ReactNode {
        const { showArr, value, row, col } = this.props;
        const chess = value[Number(showArr.find((item) => item.row === row && item.col === col)?.chess)];
        return (
            <div className={`chessboard-cell-${chess}`} />
        );
    }
}

export default Square;
