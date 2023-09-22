import { Component, ReactNode } from 'react';
import Chessboard from '@/pages/Chessboard';
import Process from '@/components/Process';
import { AppProps, AppState } from '@/interfaces/index';
import { setType } from '@/store/gameSlice';
import { connect } from 'react-redux';
import './App.css';


/**
 * 根组件
 * @returns 根组件
 */
class App extends Component<AppProps, AppState> {
    constructor (props: AppProps) {
        super(props);
        this.state  = { isRollback: false };
    }

    setIsRollback = (arg: boolean) => {
        this.setState({ isRollback: arg });
    }

    render (): ReactNode {
        return (
            <div className="App">
                <div className="info">
                    <div className="info-change">
                        <button onClick={() => this.props.setType()}>切换游戏类型</button>
                        <h2>{this.props.typeIndex ? '五子棋' : '井字棋'}</h2>
                    </div>
                    <div className="info-process">
                        {
                            <Process isRollback={this.state.isRollback} setIsRollback={this.setIsRollback}/>
                        }
                    </div>
                </div>
                <div className="board">
                    {
                        <Chessboard isRollback={this.state.isRollback} setIsRollback={this.setIsRollback}/>
                    }
                </div>
            </div>
        );
    }
}

/**
 * @param state
 */
const mapStateToProps = (state: any) => {
    return { typeIndex: state.gameSlice.typeIndex };
};

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: any) => {
    return { setType: () => dispatch(setType()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
