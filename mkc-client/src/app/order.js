import { createSlice } from '@reduxjs/toolkit'

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        value: {},
    },
    reducers: {
        update: (state, action) => {
            const { id, room, count, label, position, type } = action.payload;
            if (id && room && count > -1) {
                if (!state.value[room]) {
                    state.value[room] = {};
                }
                if (!state.value[room][type]) {
                    state.value[room][type] = {};
                }
                state.value[room][type][id] = { label, count, position };
            }
        },
        cleanAll: (state, action) => {
            state.value = {};
        },
        removedSelection: (state, action) => {
            const { id, room, type } = action.payload;
            if (room) {
                if (id) {
                    delete state.value[room][type][id];
                } else {
                    delete state.value[room];
                }
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { cleanAll, removedSelection, update, updateOption, increment, decrement, incrementByAmount } = orderSlice.actions

export default orderSlice.reducer