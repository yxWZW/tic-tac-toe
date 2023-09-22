import { Component, ReactNode } from 'react';
import { ProcessProps } from '@/interfaces';
import { setCurrentMove } from '@/store/gameSlice';
import { connect } from 'react-redux';
import './index.css';

/**
 * 步骤分步展示
 * @param history 历史步骤
 * @param setCurrentMove 改变回退的步骤数的方法
 * @returns 步骤分步展示组件
 */
class Process extends Component<ProcessProps> {
    render (): ReactNode {
        const { setCurrentMove, playArr } = this.props;
        const process = Array(playArr.length + 1).fill('');

        /**
         * 修改回退标识的状态
         * @param move 回退步进
         */
        const rollbackClick = (move: number) => {
            this.props.setIsRollback(true);
            setCurrentMove(move);
        };

        return (
            <ol>
                {process.map((_item, move) => {
                    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
                    return (
                        <li key={move}>
                            <button onClick={() => rollbackClick(move)}>{description}</button>
                        </li>
                    );
                })}
            </ol>
        );
    }
}

/**
 * @param state
 * @returns
 */
const mapStateToProps = (state: any) => {
    const { playArr } = state.gameSlice;
    return { playArr };
};

/**
 *
 * @param dispatch
 * @returns
 */
const mapDispatchToProps = (dispatch: any) => {
    return { setCurrentMove: (arg: number) => dispatch(setCurrentMove(arg)) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Process);
