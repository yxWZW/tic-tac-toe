import { useCallback, useState } from 'react';
import Chessboard from '@/pages/Chessboard';
import Process from '@/components/Process';
import { useAppSelector, useAppDispatch } from '@/interfaces/hooks';
import { setType } from '@/store/gameSlice';
import './App.css';

/**
 * 根组件
 */
const App = () => {
    const gameState = useAppSelector((state) => state.gameSlice);
    const dispatch = useAppDispatch();

    // 当前是否处于回退状态
    const [isRollback, setIsRollback] = useState<boolean>(false);
    // 当前回退数
    const [rollbackMove, setRollbackMove] = useState<number>(0);
    // 当前棋盘上棋子总数
    const [showArrLength, setShowArrLength] = useState<number>(0);

    /**
     * 修改父组件数据的方法
     * @param value 修改之后的值
     * @param type 变量类型
     */
    const onSetProps = useCallback((value: number | boolean, type: string) =>  {
        if (type === 'isRollback') setIsRollback(value as boolean);
        else if (type === 'rollbackMove') setRollbackMove(value as number);
        else if (type === 'showArrLength') setShowArrLength(value as number);
    }, []);

    // 子组件的Props
    const ChessboardPropsInfo = { isRollback, rollbackMove, onSetProps };
    const ProcessPropsInfo = { showArrLength, rollbackMove, onSetProps };

    return (
        <div className="App">
            <div className="info">
                <div className="info-change">
                    <button onClick={async () => await dispatch(setType())}>切换游戏类型</button>
                    <h2>{gameState.typeIndex ? '五子棋' : '井字棋'}</h2>
                </div>
                <div className="info-process">
                    {<Process {...ProcessPropsInfo}/>}
                </div>
            </div>
            <div className="board">
                {<Chessboard {...ChessboardPropsInfo}/>}
            </div>
        </div>
    );
};

export default App;
