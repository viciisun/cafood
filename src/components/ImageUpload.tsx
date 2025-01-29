'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  shopType: string
  onUploadComplete: (imageUrl: string) => void
}

export default function ImageUpload({ shopType, onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    setUploading(true)
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', shopType)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('上传失败')

      const data = await response.json()
      onUploadComplete(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('图片上传失败')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer block p-4 border-2 border-dashed rounded-lg text-center"
      >
        {uploading ? '上传中...' : '点击上传图片'}
      </label>
    </div>
  )
} 