// src/utils/fileUtils.ts
import { promises as fs } from 'fs'
import path from 'path'

export const deleteImageFiles = async (imagePaths: string[]) => {
  await Promise.all(
    imagePaths.map(async (imagePath) => {
      try {
        const filename = path.basename(imagePath)
        const filePath = path.join(process.cwd(), 'public', 'images', filename)
        await fs.unlink(filePath)
        console.log(`Deleted image: ${filename}`)
      } catch (error) {
        console.error(`Error deleting image ${imagePath}:`, error)
        // Tidak throw error agar tidak mengganggu alur utama
      }
    })
  )
}