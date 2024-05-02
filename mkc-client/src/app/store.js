import { configureStore } from '@reduxjs/toolkit'
import orderSlice from './order'
import messageSlice from "./message";

export default configureStore({
    reducer: {
        order: orderSlice,
        message: messageSlice
    },
})