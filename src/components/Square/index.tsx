import { memo } from 'react';
import { SquareOptions } from '@/interfaces/index';
import './index.css';

/**
 * 棋盘布局单元组件
 * @param chessType 棋子类别
 * @param value 棋子类别数组
 * @param row 落子的横坐标
 * @param row 落子的纵坐标
 */
const Square = (props: SquareOptions) => {
    const { chessType, value } = props;
    const chess = value[Number(chessType)] || 'click';
    return (
        <div className={`chessboard-cell-${chess}`}
            chess-type={`${chess}`}
        />
    );
};

export default memo(Square);
