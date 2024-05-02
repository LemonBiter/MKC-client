import { createSlice } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
    name: 'message',
    initialState: {
        value: '',
    },
    reducers: {
        update: (state, action) => {
            state.value += 'youle';
        }
    },
})

// Action creators are generated for each case reducer function
export const { update } = messageSlice.actions

export default messageSlice.reducer