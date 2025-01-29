import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const shopType = formData.get('type') as string
    
    if (!file) {
      return NextResponse.json(
        { error: '没有文件上传' },
        { status: 400 }
      )
    }

    // 生成文件名
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    
    // 确定存储路径
    const uploadDir = path.join(
      process.cwd(),
      'public',
      'images',
      'shops',
      'uploads',
      shopType.toLowerCase()
    )
    
    // 将文件转换为 Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 写入文件
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)
    
    // 返回可访问的URL路径
    const imageUrl = `/images/shops/uploads/${shopType.toLowerCase()}/${filename}`
    
    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    )
  }
} 