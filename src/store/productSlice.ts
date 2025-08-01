import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { promises as fs } from 'fs'
import path from 'path'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
}

interface ProductState {
  products: Product[]
}

const initialState: ProductState = {
  products: [],
}

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
      localStorage.setItem("products", JSON.stringify(state.products))
    },
    editProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
        localStorage.setItem("products", JSON.stringify(state.products))
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload)
      localStorage.setItem("products", JSON.stringify(state.products))
    },
    decreaseStock: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const product = state.products.find(p => p.id === action.payload.id)
      if (product && product.stock >= action.payload.quantity) {
        product.stock -= action.payload.quantity
        localStorage.setItem("products", JSON.stringify(state.products))
      }
    },
  },
})

export const {
  setProducts,
  addProduct,
  editProduct,
  deleteProduct,
  decreaseStock,
} = productSlice.actions

export default productSlice.reducer
