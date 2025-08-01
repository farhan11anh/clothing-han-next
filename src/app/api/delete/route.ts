// src/app/api/images/delete/route.ts
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function DELETE(request: Request) {
  try {
    const { imagePath } = await request.json()

    if (!imagePath) {
      return NextResponse.json(
        { success: false, error: 'Image path is required' },
        { status: 400 }
      )
    }

    // Extract filename from path
    const filename = path.basename(imagePath)
    const filePath = path.join(process.cwd(), 'public', 'images', filename)

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete file
    await fs.unlink(filePath)

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('[DELETE_IMAGE_ERROR]', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}