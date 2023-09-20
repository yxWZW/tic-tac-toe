import './App.css';
import { useState, useEffect, useRef } from 'react';
import Tictactoe from './components/Tictactoe';
import Gobang from './components/Gobang';
import Process from '@/components/Process';
import { GobangInfo, GobangMethods } from '@/interfaces/index';

/**
 * 根组件
 * @returns 根组件
 */
function App () {
    // 区别游戏类别
    const [type, setType] = useState('tic');
    // 用于记录棋盘上每一步中每个格子的状态
    const [history, setHistory] = useState([Array(9).fill(null)]);
    // 当前进行的历史状态索引
    const [currentMove, setCurrentMove] = useState(0);
    // 记录当前历史接下来应该下棋的对象（默认最开始是 X先下，之后是 O）
    const xIsNext = currentMove % 2 === 0;
    // 当前历史索引对应历史状态下的棋盘状态
    const currentSquares = history[currentMove];
    // 五子棋组件需要传递给步骤组件的数据
    const [gobangHistory, setGobangHistory] = useState<Array<GobangInfo>>([]);

    useEffect(() => {
        const type = localStorage.getItem('gameType');
        if (type) {
            setType(type);
        }
    }, [type]);

    /**
     * 切换游戏类型
     * @param type 游戏类型
     */
    const changeType = (type: string) => {
        type = type === 'tic' ? 'gob' : 'tic';
        setType(type);
        localStorage.setItem('gameType', type);
    };

    /**
     * 获取子组件中的数据
     * @param playArr 当前棋盘上所有落子形成的集合
     */
    const getGobangInfo = (playArr: Array<GobangInfo>) => {
        const newplayArr = playArr;
        setGobangHistory(newplayArr);
    };

    const gobangRef = useRef<GobangMethods>(null!);
    /**
     * 获取子组件中的方法
     * @param move 回退的步骤数
     */
    const setGobangCurrentMove = (move: number) => {
        gobangRef.current?.setCurrentMove(move);
    };

    return (
        <div className="App">
            <div className="info">
                <div className="info-change">
                    <button onClick={() => changeType(type)}>切换游戏类型</button>
                    <h2>{type === 'tic' ? '井字棋' : '五子棋'}</h2>
                </div>
                <div className="info-process">
                    {
                        type === 'tic'
                            ? <Process history={history} setCurrentMove={setCurrentMove}/>
                            : <Process history={gobangHistory} setCurrentMove={setGobangCurrentMove} />
                    }
                </div>
            </div>
            <div className="board">
                {
                    type === 'tic'
                        ? <Tictactoe
                            history={history}
                            xIsNext={xIsNext}
                            currentMove={currentMove}
                            currentSquares={currentSquares}
                            setHistory={setHistory}
                            setCurrentMove={setCurrentMove}
                        />
                        : <Gobang getGobangInfo={getGobangInfo} ref={gobangRef} />
                }
            </div>
        </div>
    );
}

export default App;
