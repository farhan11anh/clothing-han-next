"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import {
  addProduct,
  editProduct,
  Product,
} from "@/store/productSlice"
import { useState, useEffect } from "react"
const uuidv4 = () => crypto.randomUUID();

interface Props {
  open: boolean
  onClose: () => void
  product?: Product | null
}

export function ProductFormModal({ open, onClose, product }: Props) {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  })

  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image: product.image,
      })
    } else {
      setForm({
        id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
      })
    }
  }, [product])

  const handleSubmit = () => {
    const payload: Product = {
      id: product?.id || uuidv4(),
      name: form.name,
      description: form.description,
      price: parseInt(form.price),
      stock: parseInt(form.stock),
      image: form.image,
    }

    if (product) {
      dispatch(editProduct(payload))
    } else {
      dispatch(addProduct(payload))
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            placeholder="Nama Produk"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Deskripsi"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <Input
            placeholder="Harga"
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
          <Input
            placeholder="Stok"
            type="number"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
          />
          <Input
            placeholder="URL Gambar"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
          />
          <Button onClick={handleSubmit} className="w-full">
            {product ? "Simpan Perubahan" : "Tambah Produk"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
