import { useState, useEffect, useRef } from 'react';
import { GobangInfo, GobangMethods, GameType } from '@/interfaces/index';
import Chessboard from '@/pages/Chessboard';
import Process from '@/components/Process';
import './App.css';

/**
 * 根组件
 * @returns 根组件
 */
const App = () => {
    // 游戏参数
    const types: Array<GameType> = [
        {
            size: 3,
            chess: ['X', 'O'],
            win: 3,
        },
        {
            size: 15,
            chess: ['black', 'white'],
            win: 5,
        },
    ];

    const [typeIndex, setTypeIndex] = useState<number>(0);

    // 五子棋组件需要传递给步骤组件的数据
    const [history, setHistory] = useState<Array<GobangInfo>>([]);

    useEffect(() => {
        const typeIndex = localStorage.getItem('gameType');
        if (typeIndex) {
            setTypeIndex(Number(typeIndex));
        }
    }, [setTypeIndex]);

    /**
     * 切换游戏类型
     * @param type 游戏类型
     */
    const changeType = (typeIndex: number) => {
        typeIndex = Number(!typeIndex);
        setTypeIndex(typeIndex);
        localStorage.setItem('gameType', typeIndex.toString());
    };

    /**
     * 获取子组件中的数据
     * @param playArr 当前棋盘上所有落子形成的集合
     */
    const getGobangInfo = (playArr: Array<GobangInfo>) => {
        const newplayArr = playArr;
        setHistory(newplayArr);
    };

    const gobangRef = useRef<GobangMethods>(null!);
    /**
     * 获取子组件中的方法
     * @param move 回退的步骤数
     */
    const setBoardCurrentMove = (move: number) => {
        gobangRef.current?.setCurrentMove(move);
    };

    return (
        <div className="App">
            <div className="info">
                <div className="info-change">
                    <button onClick={() => changeType(typeIndex)}>切换游戏类型</button>
                    <h2>{typeIndex ? '五子棋' : '井字棋'}</h2>
                </div>
                <div className="info-process">
                    {
                        <Process history={history} setCurrentMove={setBoardCurrentMove}/>
                    }
                </div>
            </div>
            <div className="board">
                {
                    <Chessboard gameType={types[typeIndex]} getGobangInfo={getGobangInfo} ref={gobangRef}></Chessboard>
                }
            </div>
        </div>
    );
};

export default App;
