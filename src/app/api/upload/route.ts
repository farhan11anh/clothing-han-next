// src/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic' // Important for file uploads

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files uploaded' },
        { status: 400 }
      )
    }

    // Create images directory if not exists
    const uploadDir = path.join(process.cwd(), 'public', 'images')
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    const uploadedPaths: string[] = []

    // Process each file
    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        continue // Skip invalid files
      }

      // Validate file size (5MB max)
      const MAX_SIZE = 5 * 1024 * 1024
      if (file.size > MAX_SIZE) {
        continue // Skip large files
      }

      // Generate unique filename
      const timestamp = Date.now()
      const ext = path.extname(file.name)
      const filename = `product-${timestamp}-${Math.random()
        .toString(36)
        .substring(2, 9)}${ext}`
      
      const filePath = path.join(uploadDir, filename)
      const buffer = Buffer.from(await file.arrayBuffer())

      // Save file
      await fs.writeFile(filePath, buffer)
      uploadedPaths.push(`/images/${filename}`)
    }

    if (uploadedPaths.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid files uploaded' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      paths: uploadedPaths,
      message: `${uploadedPaths.length} file(s) uploaded successfully`
    })

  } catch (error) {
    console.error('[UPLOAD_ERROR]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}