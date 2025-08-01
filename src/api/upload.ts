// src/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import multiparty from 'multiparty'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const form = new multiparty.Form()
    const { files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    const file = files.file[0]
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.headers['content-type'])) {
      return res.status(400).json({ message: 'Invalid file type' })
    }

    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return res.status(400).json({ message: 'File too large (max 5MB)' })
    }

    const fileName = `product-${Date.now()}-${file.originalFilename}`
    const uploadPath = path.join(process.cwd(), 'public', 'images', fileName)
    console.log(uploadPath);
    await fs.copyFile(file.path, uploadPath)
    
    return res.status(200).json({ path: `/images/${fileName}` })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ message: 'Error uploading file' })
  }
}