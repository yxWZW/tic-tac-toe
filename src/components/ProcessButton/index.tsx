import { Component, ReactNode } from 'react';
import { ProcessbuttonProps } from '@/interfaces/index';
import './index.css';

/**
 * 回退按钮组件
 * @param description 当前按钮文本
 * @param move 当前按钮索引
 * @param rollbackMove 当前棋盘历史索引
 * @param rollbackClick 修改当前棋盘历史索引
 */
class ProcessButton extends Component<ProcessbuttonProps> {
    /**
     * 控制回退按钮组件的渲染
     */
    shouldComponentUpdate (nextProps: ProcessbuttonProps) {
        const { move, rollbackMove } = this.props;
        if (move !== rollbackMove && move !== nextProps.rollbackMove) return false;
        return true;
    }
    render (): ReactNode {
        // console.log('ProcessButton渲染了');
        const { description, move, rollbackMove, rollbackClick } = this.props;
        return (
            <button onClick={() => rollbackClick(move)}
                className={`${rollbackMove === move ? 'current-button' : ''}`}>
                {description}
            </button>
        );
    }
}

export default ProcessButton;
