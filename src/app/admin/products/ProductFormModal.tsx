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
import { useState, useEffect, useRef } from "react"
const uuidv4 = () => crypto.randomUUID();
import { X, Loader2 } from "lucide-react";

interface Props {
    open: boolean
    onClose: () => void
    product?: Product | null
}

export function ProductFormModal({ open, onClose, product }: Props) {
    const dispatch = useDispatch()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    const [form, setForm] = useState({
        id: "",
        name: "",
        description: "",
        price: "",
        stock: "",
        images: [] as string[], // Ganti dari image ke images (array)
    })

    const [errors, setErrors] = useState({
        price: "",
        stock: "",
        images: "" // Update nama field
    })


    useEffect(() => {
        if (product) {
            setForm({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price.toLocaleString('id-ID'),
                stock: product.stock.toString(),
                images: product.images || [], // Ganti ke array images
            })
        } else {
            setForm({
                id: "",
                name: "",
                description: "",
                price: "",
                stock: "",
                images: [], // Inisialisasi sebagai array kosong
            })
        }
        setErrors({ price: "", stock: "", images: "" })
    }, [product, open])

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        const numericValue = parseInt(value || '0', 10)
        const formattedValue = numericValue.toLocaleString('id-ID')
        setForm({ ...form, price: formattedValue })
        if (errors.price) setErrors({ ...errors, price: "" })
    }

    const parsePrice = (formattedValue: string) => {
        return parseInt(formattedValue.replace(/\./g, ''), 10) || 0
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)

        try {
            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]) // Gunakan 'files' bukan 'file'
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            const result = await response.json()
            setForm(prev => ({
                ...prev,
                images: [...prev.images, ...result.paths] // Gabungkan gambar baru
            }))
            setErrors(prev => ({ ...prev, images: "" }))

        } catch (error) {
            console.error('Upload failed:', error)
            setErrors(prev => ({ ...prev, images: 'Upload gagal' }))
        } finally {
            setIsUploading(false)
        }
    }

    // Fungsi untuk menghapus gambar
    // Fungsi untuk menghapus gambar saat edit
    const removeImage = async (index: number) => {
        const imageToDelete = form.images[index]

        try {
            // Hapus dari server
            const response = await fetch('/api/images/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imagePath: imageToDelete }),
            })

            if (!response.ok) {
                throw new Error('Failed to delete image from server')
            }

            // Hapus dari state
            setForm(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }))

        } catch (error) {
            console.error('Error deleting image:', error)
        }
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = { price: "", stock: "", images: "" }

        const priceValue = parsePrice(form.price)
        if (priceValue < 1000) {
            newErrors.price = "Harga harus minimal Rp1.000"
            isValid = false
        }

        if (parseInt(form.stock) < 0) {
            newErrors.stock = "Stok tidak boleh negatif"
            isValid = false
        }

        // Validasi minimal 1 gambar
        if (form.images.length === 0 && (!product || product.images.length === 0)) {
            newErrors.images = "Minimal 1 gambar diperlukan"
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: "" })
        }
    }

    const handleSubmit = () => {
        if (!validateForm()) return

        const payload: Product = {
            id: product?.id || uuidv4(),
            name: form.name,
            description: form.description,
            price: parsePrice(form.price),
            stock: parseInt(form.stock),
            images: form.images.length > 0
                ? form.images
                : product?.images || [] // Gunakan gambar baru atau yang sudah ada
        }

        if (product) {
            dispatch(editProduct(payload))
        } else {
            dispatch(addProduct(payload))
        }

        onClose()
    }

    const isFormValid =
        form.name &&
        form.description &&
        form.price &&
        form.stock &&
        (form.images.length > 0 || (product?.images && product.images.length > 0)) &&
        !errors.price &&
        !errors.stock &&
        !errors.images

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Input
                            name="name"
                            placeholder="Nama Produk"
                            value={form.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <Input
                            name="description"
                            placeholder="Deskripsi"
                            value={form.description}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                            <Input
                                name="price"
                                placeholder="Harga"
                                className="pl-10"
                                value={form.price}
                                onChange={handlePriceChange}
                                onBlur={validateForm}
                            />
                        </div>
                        {errors.price && (
                            <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            name="stock"
                            placeholder="Stok"
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={handleInputChange}
                            onBlur={validateForm}
                        />
                        {errors.stock && (
                            <p className="text-sm text-red-500 mt-1">{errors.stock}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            multiple // Tambahkan atribut multiple
                            className="hidden"
                        />

                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full"
                        >
                            {isUploading ? "Mengunggah..." : "Unggah Gambar (Bisa Multiple)"}
                        </Button>

                        {isUploading && (
                            <div className="flex items-center justify-center h-24 border rounded">
                                <Loader2 className="animate-spin h-6 w-6" />
                            </div>
                        )}

                        {/* Preview gambar */}
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {form.images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={img}
                                        alt={`Preview ${index + 1}`}
                                        className="h-24 w-full object-cover rounded border"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {errors.images && (
                            <p className="text-sm text-red-500 mt-1">{errors.images}</p>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={!isFormValid || isUploading}
                    >
                        {product ? "Simpan Perubahan" : "Tambah Produk"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}