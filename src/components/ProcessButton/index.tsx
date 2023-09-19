import { ProcessbuttonProps } from '@/interfaces/index';
import { memo } from 'react';
import './index.css';

/**
 * 回退按钮组件
 * @param description 当前按钮文本
 * @param move 当前按钮索引
 * @param currentMove 当前棋盘历史索引
 * @param rollbackClick 修改当前棋盘历史索引
 */
const ProcessButton = (props: ProcessbuttonProps) => {
    const { description, move, currentMove, rollbackClick } = props;
    return (
        <button onClick={() => rollbackClick(move)}
            className={`${currentMove === move ? 'current-button' : ''}`}>
            {description}
        </button>
    );
};

export default memo(ProcessButton);
