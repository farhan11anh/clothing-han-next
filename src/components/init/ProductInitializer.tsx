"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setProducts } from "@/store/productSlice"
import type { AppDispatch } from "@/store"

export const ProductInitializer = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const saved = localStorage.getItem("products")
    if (saved) {
      dispatch(setProducts(JSON.parse(saved)))
    } else {
      fetch("/data/items.json")
        .then(res => res.json())
        .then(data => {
          dispatch(setProducts(data))
          localStorage.setItem("products", JSON.stringify(data))
        })
    }
  }, [])

  return null
}
