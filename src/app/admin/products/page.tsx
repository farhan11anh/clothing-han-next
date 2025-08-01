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
import { DeleteConfirm } from "@/components/DeleteConfirm"

export default function AdminProductPage() {
  const products = useSelector((state: RootState) => state.product.products)
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<{ id: string, name: string } | null>(null)

  // When delete button is clicked
  const handleDeleteClick = (product: Product) => {
    setProductToDelete({ id: product.id, name: product.name })
    setDeleteDialogOpen(true)
  }

  return (
    <AdminLayout>
      <DeleteConfirm
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        product={productToDelete}
      />
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
                  <img src={product.images?.[0]} alt={product.name} className="h-14 w-14 object-cover rounded" />
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
                  <Button
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                    className="text-white-600 hover:text-white-800 bg-red-600 hover:bg-red-700"
                  >
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
