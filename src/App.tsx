import { useRef } from 'react';
import { GobangMethods } from '@/interfaces/index';
import Chessboard from '@/pages/Chessboard';
import Process from '@/components/Process';
import { useAppSelector, useAppDispatch } from '@/interfaces/hooks';
import { setType } from '@/store/gameSlice';
import './App.css';

/**
 * 根组件
 * @returns 根组件
 */
const App = () => {
    const gameState = useAppSelector((state) => state.gameSlice);
    const dispatch = useAppDispatch();

    const chessboardRef = useRef<GobangMethods>(null!);
    /**
     * 获取子组件中的方法
     * @param move 回退的步骤数
     */
    const setBoardCurrentMove = (move: number) => {
        chessboardRef.current?.setCurrentMove(move);
    };

    return (
        <div className="App">
            <div className="info">
                <div className="info-change">
                    <button onClick={async () => await dispatch(setType())}>切换游戏类型</button>
                    <h2>{gameState.typeIndex ? '五子棋' : '井字棋'}</h2>
                </div>
                <div className="info-process">
                    {
                        <Process setCurrentMove={setBoardCurrentMove} />
                    }
                </div>
            </div>
            <div className="board">
                {
                    <Chessboard ref={chessboardRef}></Chessboard>
                }
            </div>
        </div>
    );
};

export default App;
