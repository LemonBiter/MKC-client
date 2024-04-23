import { configureStore } from '@reduxjs/toolkit'
import orderSlice from './order'

export default configureStore({
    reducer: {
        order: orderSlice,
    },
})