import { BaseColumnCard } from "@/server/db/schema";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store";
interface UserSubscribeState {
    subscribeColumnList: BaseColumnCard[]
}

export const userSubscribeSlice = createSlice({
    name: 'userSubscribe',
    initialState: {
        subscribeColumnList: []
    } as UserSubscribeState,
    reducers: {
        setSubscribeColumnList: (state, action: PayloadAction<BaseColumnCard[]>) => {
            state.subscribeColumnList = action.payload
        },
    }
})

export const { setSubscribeColumnList } = userSubscribeSlice.actions;

export const userSubscribeSelector = (state: RootState) => state.userSubscribe;
export default userSubscribeSlice.reducer;