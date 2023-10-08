import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { setType } from '@/store/gameSlice';
import Chessboard from '@/pages/Chessboard';
import Process from '@/components/Process';
import { AppProps, AppState } from '@/interfaces/index';
import './App.css';

/**
 * 根组件
 * @param typeIndex 游戏类型索引
 * @param setType 修改游戏类型索引
 */
class App extends Component<AppProps, AppState> {
    constructor (props: AppProps) {
        super(props);
        this.state = {
            isFirstAI: false,  // 是否 AI先手
            isRollback: false, // 当前是否处于回退状态
            rollbackMove: 0,   // 当前回退数
            showArrLength: 0,  // 当前棋盘上棋子总数
        };
    }

    /**
     * 游戏先手发生变化
     */
    setIsFirstAI = () => {
        const { isFirstAI } = this.state;
        this.setState({ isFirstAI: !isFirstAI });
    }

    /**
     * 修改父组件数据的方法
     * @param value 修改之后的值
     * @param type 变量类型
     */
    onSetProps = (value: number | boolean, type: string) => {
        if (type === 'isRollback') this.setState({ isRollback: value as boolean });
        else if (type === 'rollbackMove') this.setState({ rollbackMove: value as number });
        else if (type === 'showArrLength') this.setState({ showArrLength: value as number });
    }

    render (): ReactNode {
        const { isRollback, rollbackMove, showArrLength, isFirstAI } = this.state;
        const { onSetProps, setIsFirstAI } = this;
        const { typeIndex } = this.props;
        const ChessboardPropsInfo = { isRollback, rollbackMove, isFirstAI, onSetProps };
        const ProcessPropsInfo = { showArrLength, rollbackMove, isFirstAI, typeIndex, onSetProps };

        return (
            <div className="App">
                <div className="info">
                    <div className="info-change">
                        <button onClick={() => this.props.setType()}>切换游戏类型</button>
                        <h2>{this.props.typeIndex ? '五子棋' : '井字棋'}</h2>
                        {
                            !this.props.typeIndex
                                ? <button onClick={() => setIsFirstAI()} disabled={Boolean(showArrLength)}>
                                    { isFirstAI ? 'AI先手' : '玩家先手'}
                                </button>
                                : ''
                        }
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
    }
}

/**
 * 建立组件跟 store的 state的映射关系
 */
const mapStateToProps = (state: any) => {
    return { typeIndex: state.gameSlice.typeIndex };
};

/**
 * 建立组件跟 store.dispatch的映射关系
 */
const mapDispatchToProps = (dispatch: any) => {
    return { setType: () => dispatch(setType()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
