import { createSlice } from "@reduxjs/toolkit"

export interface User {
  username: string
  role: "admin" | "buyer"
}

interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
    logout(state) {
      state.user = null
      localStorage.removeItem("user")
    },
    restore(state) {
      const saved = localStorage.getItem("user")
      if (saved) {
        state.user = JSON.parse(saved)
      }
    }
  }
})

export const { login, logout, restore } = authSlice.actions
export default authSlice.reducer
