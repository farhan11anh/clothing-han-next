"use client"

import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import {
  deleteProduct,
  Product,
} from "@/store/productSlice"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { ProductInitializer } from "@/components/init/ProductInitializer"
import { ProductFormModal } from "./ProductFormModal"
import AdminNavbar from "@/components/AdminSidebar"
import AdminLayout from "@/components/AdminLayout"

export default function AdminProductPage() {
  const products = useSelector((state: RootState) => state.product.products)
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      dispatch(deleteProduct(id))
    }
  }

  return (
    <AdminLayout>
      <div className=" space-y-4">
        <ProductInitializer />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Manajemen Produk</h1>
          <Button onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}>
            Tambah Produk
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <img src={product.image} alt={product.name} className="h-14 w-14 object-cover rounded" />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" onClick={() => {
                    setEditing(product)
                    setModalOpen(true)
                  }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ProductFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          product={editing}
        />
      </div>
    </AdminLayout>

  )
}
