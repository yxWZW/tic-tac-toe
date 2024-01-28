import { Component, ReactNode } from 'react';
import { ProcessbuttonProps } from '@/interfaces/index';
import './index.css';

/**
 * 回退按钮组件
 * @param description 当前按钮文本
 * @param move 当前按钮索引
 * @param rollbackMove 当前棋盘历史索引
 * @param rollbackClick 修改当前棋盘历史索引
 * @param isClickState 根据当前局面是否为AI落子来进行回退按钮禁用
 */
class ProcessButton extends Component<ProcessbuttonProps> {
    /**
     * 控制回退按钮组件的渲染
     */
    shouldComponentUpdate(nextProps: ProcessbuttonProps) {
        const { move, rollbackMove, isClickState } = this.props;
        if (move !== rollbackMove &&
            move !== nextProps.rollbackMove &&
            isClickState === nextProps.isClickState) return false;
        return true;
    }
    render(): ReactNode {
        const { description, move, rollbackMove, isClickState, rollbackClick } = this.props;
        return (
            <button onClick={() => rollbackClick(move)}
                disabled={isClickState}
                className={`${rollbackMove === move ? 'current-button' : ''}`}>
                {description}
            </button>
        );
    }
}

export default ProcessButton;
