'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShopType, ShopStatus } from '@prisma/client'

interface ShopFormData {
  name: string
  type: ShopType
  address: string
  latitude: number
  longitude: number
  description?: string
  priceLevel: number
}

export default function AddShopPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    type: ShopType.CAFE,
    address: '',
    latitude: 0,
    longitude: 0,
    description: '',
    priceLevel: 2
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ShopFormData, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ShopFormData, string>> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '店铺名称不能为空'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = '地址不能为空'
    }
    
    if (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = '纬度必须在-90到90之间'
    }
    
    if (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = '经度必须在-180到180之间'
    }
    
    if (formData.priceLevel < 1 || formData.priceLevel > 4) {
      newErrors.priceLevel = '价格等级必须在1到4之间'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: ShopStatus.OPEN,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create shop')
      }

      router.push('/main')
    } catch (error) {
      console.error('Error creating shop:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">添加新店铺</h1>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            店铺名称 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            店铺类型 *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as ShopType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {Object.values(ShopType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            地址 *
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              纬度 *
            </label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              经度 *
            </label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            价格等级 (1-4) *
          </label>
          <input
            type="number"
            min="1"
            max="4"
            value={formData.priceLevel}
            onChange={(e) => setFormData({ ...formData, priceLevel: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.priceLevel && <p className="mt-1 text-sm text-red-600">{errors.priceLevel}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            添加店铺
          </button>
        </div>
      </form>
    </div>
  )
} 