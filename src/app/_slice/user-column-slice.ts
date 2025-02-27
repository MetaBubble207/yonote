import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "./store";
interface UserColumnState {
    searchTag: string
}

export const userColumnSlice = createSlice({
    name: 'userColumn',
    initialState: {
        searchTag: "all"
    } as UserColumnState,
    reducers: {
        setSearchTag: (state, action: PayloadAction<string>) => {
            state.searchTag = action.payload
        },
    }
})

export const { setSearchTag } = userColumnSlice.actions;

export const userColumnSelector = (state: RootState) => state.userColumn;
export default userColumnSlice.reducer;