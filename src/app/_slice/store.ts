import { configureStore } from "@reduxjs/toolkit"
import { userSubscribeSlice } from "./user-subscribe-slice"

export const makeStore = () => {
    return configureStore({
        reducer: {
            userSubscribe: userSubscribeSlice.reducer
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];