import { Component, ReactNode } from 'react';
import Square from '@/components/Square';
import { TitleProps, playingTitlesInfo } from '@/interfaces/index';
import './index.css';

/**
 * 游戏显示下个落子类型
 * @param currentMove 当前回退数
 * @param xIsNext 下个落子类型标识
 * @param isOver 游戏是否结束
 * @param chess 游戏棋子种类
 * @param size 游戏棋盘大小
 */
class Title extends Component<TitleProps> {
    /**
     * 计算当前游戏进度标题
     * @returns 游戏进度标题
     */
    playingTitles = (): playingTitlesInfo => {
        const { currentMove, xIsNext, isOver, chess, size } = this.props;
        let title = '';
        let chessType = '';
        if (isOver) {
            title = 'Winner: ';
            chessType = chess[Number(!xIsNext)];
        } else if (currentMove !== size * size && !isOver) {
            title = 'Next player: ';
            chessType = chess[Number(xIsNext)];
        } else  {
            title = 'A dead heat';
        }
        return { title, chessType };
    };
    render (): ReactNode {
        const { title, chessType } = this.playingTitles();
        return (
            <div className="title-box">
                <div className="title-next">
                    <p className='title-next-p'>{title}</p>
                    <Square chessType={chessType} />
                </div>
            </div>
        );
    }
}

export default Title;
