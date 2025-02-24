import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../_slice/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();