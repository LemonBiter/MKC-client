import { createSlice } from '@reduxjs/toolkit'

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        value: {},
    },
    reducers: {
        update: (state, action) => {
            const { room, type, value } = action.payload;
            if (!state.value[room]) {
                state.value[room] = {};
            }
            state.value[room][type] = value;
        },
        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { update, increment, decrement, incrementByAmount } = orderSlice.actions

export default orderSlice.reducer