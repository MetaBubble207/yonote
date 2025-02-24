import { BaseColumnCardDateString } from "@/server/db/schema";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store";
interface UserSubscribeState {
    subscribeColumnList: BaseColumnCardDateString[]
}

export const userSubscribeSlice = createSlice({
    name: 'userSubscribe',
    initialState: {
        subscribeColumnList: []
    } as UserSubscribeState,
    reducers: {
        setSubscribeColumnList: (state, action: PayloadAction<BaseColumnCardDateString[]>) => {
            state.subscribeColumnList = action.payload
        },
        updateSubscribeColumnList: (state, action: PayloadAction<BaseColumnCardDateString>) => {
            state.subscribeColumnList = state.subscribeColumnList.map((item) => {
                if (item.id === action.payload.id) {
                    return action.payload
                }
                return item
            })
        }
    }
})

export const { setSubscribeColumnList, updateSubscribeColumnList } = userSubscribeSlice.actions;

export const userSubscribeSelector = (state: RootState) => state.userSubscribe;
export default userSubscribeSlice.reducer;