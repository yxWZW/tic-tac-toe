import './index.css';
import { useImperativeHandle, forwardRef } from 'react';
import useHook from './useHook';
import { ChildMethods, GobangOptions } from '@/interfaces/index';

/**
 * 五子棋组件
 * @param getGobangInfo 获取组件数据
 * @param onRef 获取组件DOM元素
 * @returns 五子棋组件
 */
const Gobang = forwardRef<ChildMethods, GobangOptions>((props, ref) => {
    const { getGobangInfo } = props;

    // 用于遍历生成棋盘
    const border = Array(20).fill(null);

    const { showArr, status, play, rollbackProcess } = useHook(getGobangInfo);

    // 在使用 ref 时自定义暴露给父组件的实例值
    useImperativeHandle(ref, () => {
        return { setCurrentMove: rollbackProcess };
    });

    return (
        <div className="chessboard-wrapper">
            <p className="chessboard-title">{status}</p>
            <div className="chessboard">
                {border.map((_item, rowIndex) => (
                    <div className="chessboard-row" key={`row + ${rowIndex}`}>
                        {border.map((_item, colIndex) => (
                            <div className="chessboard-col" key={`col + ${colIndex}`}>
                                <div className="chessboard-cell">
                                    {
                                        // eslint-disable-next-line no-nested-ternary
                                        showArr.find(item => item.row === rowIndex && item.col === colIndex)
                                            ? (
                                                showArr.find((item) => item.row === rowIndex && item.col === colIndex)?.chess
                                                    ? (<div className="chessboard-cell-black" />)
                                                    : (<div className="chessboard-cell-white" />)
                                            )
                                            : (<div className="chessboard-cell-click" onClick={() => play(rowIndex, colIndex)} />)
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
});
export default Gobang;
