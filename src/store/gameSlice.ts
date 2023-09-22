import { createSlice } from '@reduxjs/toolkit';
import { CounterState } from '@/interfaces/index';

// 使用该类型定义初始 state
const initialState: CounterState = {
    types: [ // 游戏类型
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
    ],
    typeIndex: 0, // 游戏类型索引
    playArr: [],  // 当前棋盘上所有落子形成的集合，包含每个落子的横纵坐标和类型
    currentMove: 0, // 当前进行的历史状态索引
};

export const counterSlice = createSlice({
    name: 'gameSlice',
    initialState,
    reducers: {
        setType: (state) => {
            state.typeIndex = Number(!state.typeIndex);
        },
        setPlayArr: (state, action) => {
            state.playArr = [...action.payload];
        },
        setCurrentMove: (state, action) => {
            state.currentMove = action.payload;
        },
    },
});

export const { setType, setPlayArr, setCurrentMove } = counterSlice.actions;
export default counterSlice.reducer;
