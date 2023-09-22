import { ProcessOptions } from '@/interfaces';
import { useAppSelector } from '@/interfaces/hooks';
import './index.css';

/**
 * 步骤分步展示
 * @param history 历史步骤
 * @param setCurrentMove 改变回退的步骤数的方法
 * @returns 步骤分步展示组件
 */
const Process = ({ setCurrentMove }: ProcessOptions) => {
    const gameState = useAppSelector((state) => state.gameSlice);
    const { playArr } = gameState;
    const process = Array(playArr.length + 1).fill('');

    return (
        <ol>
            {process.map((_item, move) => {
                const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
                return (
                    <li key={move}>
                        <button onClick={() => setCurrentMove(move)}>{description}</button>
                    </li>
                );
            })}
        </ol>
    );
};

export default Process;
