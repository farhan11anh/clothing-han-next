"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { login, restore } from "@/store/authSlice"
import { RootState } from "@/store"

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "buyer", password: "buyer123", role: "buyer" },
]

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth.user)

  const [form, setForm] = useState({ username: "", password: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    dispatch(restore())
  }, [])

  useEffect(() => {
    if (auth) {
      router.push(auth.role === "admin" ? "/admin/products" : "/shop")
    }
  }, [auth])

  const handleLogin = () => {
    const found = users.find(
      u => u.username === form.username && u.password === form.password
    )

    if (!found) {
      setError("Username atau password salah.")
      return
    }

    dispatch(login({ username: found.username, role: found.role }))
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 rounded shadow max-w-sm w-full border">
        <h1 className="text-xl font-semibold mb-4">Login</h1>

        <Input
          placeholder="Username"
          className="mb-2"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          className="mb-2"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button className="mt-2 w-full" onClick={handleLogin}>
          Masuk
        </Button>
      </div>
    </div>
  )
}
