import { SquareOptions } from '@/interfaces/index';
import { Component, ReactNode } from 'react';
import './index.css';

/**
 * 棋子组件
 * @param chessType 棋子类别
 * @param value 棋子类别数组
 */
class Square extends Component<SquareOptions> {
    /**
     * 控制棋子组件的渲染
     */
    shouldComponentUpdate(nextProps: SquareOptions) {
        if (this.props.chessType === nextProps.chessType) return false;
        return true;
    }

    render(): ReactNode {
        const { chessType } = this.props;
        return (
            <div className={`chessboard-cell-${chessType}`} />
        );
    }
}

export default Square;
