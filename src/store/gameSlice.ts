import { createSlice } from '@reduxjs/toolkit';
import { CounterState } from '@/interfaces/index';

// 游戏类型
const gameTypes = [
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

// 游戏历史记录
const gameHistory = Array(gameTypes.length).fill({
    historyResult: false,
    historyArr: [],
    historyMove: 0,
});

const initialState: CounterState = {
    types: gameTypes,     // 游戏类型
    history: gameHistory, // 游戏历史
    typeIndex: 0,         // 游戏类型索引
};

export const counterSlice = createSlice({
    name: 'gameSlice',
    initialState,
    reducers: {
        setType: (state) => {
            state.typeIndex = Number(!state.typeIndex);
        },
        setHistory: (state, action) => {
            const { showArr, currentMove, isOver } = action.payload;
            if (showArr.length > 0) {
                state.history[Number(!state.typeIndex)] = {
                    historyResult: isOver,
                    historyArr: showArr,
                    historyMove: currentMove,
                };
            }
        },
    },
});

export const { setType, setHistory } = counterSlice.actions;
export default counterSlice.reducer;
