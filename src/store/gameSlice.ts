import { createSlice } from '@reduxjs/toolkit';
import { GameStateOptions } from '@/interfaces/index';

// 游戏类型
const GAME_TYES = [
    {
        size: 3,
        chess: ['X', 'O'],
        win: 3,
    },
    {
        size: 15,
        chess: ['B', 'W'],
        win: 5,
    },
];

// 游戏历史记录
const GAME_HISTORY = Array(GAME_TYES.length).fill({
    historyResult: false,
    historyArr: [],
    historyMove: 0,
});

const initialState: GameStateOptions = {
    types: GAME_TYES,      // 游戏类型
    history: GAME_HISTORY, // 游戏历史
    typeIndex: 0,          // 游戏类型索引
};

export const gameSlice = createSlice({
    name: 'gameSlice',
    initialState,
    reducers: {
        setType: (state) => {
            state.typeIndex = Number(!state.typeIndex);
        },
        setHistory: (state, action) => {
            const { historyResult, historyArr, historyMove } = action.payload;
            if (historyArr.length > 0) {
                state.history[Number(!state.typeIndex)] = {
                    historyResult,
                    historyArr,
                    historyMove,
                };
            }
        },
    },
});

export const { setType, setHistory } = gameSlice.actions;
export default gameSlice.reducer;
