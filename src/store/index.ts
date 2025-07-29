import { configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import authReducer from "./authSlice"
import productReducer from "./productSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
})

// Type exports
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
