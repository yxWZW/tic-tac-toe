import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { ProcessProps } from '@/interfaces/index';
import ProcessButton from '@/components/ProcessButton/index';
import './index.css';

/**
 * 步骤展示组件
 * @param rollbackMove 当前回退数
 * @param showArrLength 当前棋盘上棋子总数
 * @param onSetProps 修改父组件数据的方法
 */
class Process extends Component<ProcessProps> {
    /**
     * 控制步骤展示组件的渲染
     */
    shouldComponentUpdate (nextProps: ProcessProps) {
        const { showArrLength, rollbackMove, typeIndex } = this.props;
        if (showArrLength === nextProps.showArrLength &&
            rollbackMove === nextProps.rollbackMove &&
            typeIndex === nextProps.typeIndex) return false;
        return true;
    }

    /**
     * 修改回退标识的状态
     * @param move 回退步进
     */
    rollbackClick = (move: number) => {
        const { onSetProps } = this.props;
        onSetProps(true, 'isRollback');
        onSetProps(move, 'rollbackMove');
    };

    render (): ReactNode {
        // console.log('Process渲染了');
        const { typeIndex, isFirstAI, showArrLength, rollbackMove } = this.props;
        return (
            <ol>
                {Array.from({ length: showArrLength + 1 }).map((_item, move) => {
                    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
                    const isClickState = !typeIndex && (move !== showArrLength) && ((isFirstAI && move % 2 === 0) || (!isFirstAI && move % 2 !== 0));
                    const processbuttonProps = { description, move, rollbackMove, isClickState, rollbackClick: this.rollbackClick };
                    return (
                        <li key={move}>
                            <ProcessButton {...processbuttonProps} />
                        </li>
                    );
                })}
            </ol>
        );
    }
}

/**
 * 建立组件跟 store的 state的映射关系
 */
const mapStateToProps = (state: any) => {
    return { typeIndex: state.gameSlice.typeIndex };
};
export default connect(mapStateToProps)(Process);

