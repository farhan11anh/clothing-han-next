"use client"

import { Provider } from "react-redux"
import { store } from "@/store"
import { useEffect } from "react"
import { useAppDispatch } from "@/store"
import { login } from "@/store/authSlice"

function ReduxInitializer() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      dispatch(login(JSON.parse(savedUser)))
    }
  }, [dispatch])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxInitializer />
      {children}
    </Provider>
  )
}
