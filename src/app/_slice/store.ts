import { configureStore } from "@reduxjs/toolkit"
import { userSubscribeSlice } from "./user-subscribe-slice"
import { userColumnSlice } from "./user-column-slice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            userSubscribe: userSubscribeSlice.reducer,
            userColumn: userColumnSlice.reducer
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];