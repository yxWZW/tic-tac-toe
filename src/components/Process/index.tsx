import { useCallback, useEffect, useState } from 'react';
import { ProcessProps } from '@/interfaces/index';
import ProcessButton from '@/components/ProcessButton/index';
import './index.css';

/**
 * 步骤分步展示
 * @param history 历史步骤
 * @param showArrLength 当前棋盘上棋子总数
 * @param setIsRollback 修改回退状态
 * @param setRollbackMove 修改回退数
 */
const Process = (props: ProcessProps) => {
    const { showArrLength, rollbackMove, onSetProps } = props;
    const [currentMove, setCurrentMove] = useState(0);

    // 有历史回退，更改历史索引
    useEffect(() => {
        setCurrentMove(rollbackMove);
    }, [showArrLength, rollbackMove]);

    /**
     * 修改回退标识的状态
     * @param move 回退步进
     */
    const rollbackClick = useCallback((move: number) => {
        onSetProps(true, 'isRollback');
        onSetProps(move, 'rollbackMove');
        setCurrentMove(move);
    }, []);

    return (
        <ol>
            {Array.from({ length: showArrLength + 1 }).map((_item, move) => {
                const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
                const processbuttonProps = { description, move, currentMove, rollbackClick };
                return (
                    <li key={move}>
                        <ProcessButton {...processbuttonProps} />
                    </li>
                );
            })}
        </ol>
    );
};

export default Process;
