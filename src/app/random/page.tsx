'use client'

import { useState, useEffect } from 'react'
import { Shop } from '@prisma/client'
import SpinningWheel from '@/components/SpinningWheel'
import ShopCard from '@/components/ShopCard'

export default function RandomPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 获取商店数据
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/shops')
        if (!response.ok) throw new Error('Failed to fetch shops')
        const data = await response.json()
        setShops(data)
      } catch (error) {
        console.error('Error fetching shops:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShops()
  }, [])

  const handleSpinEnd = (shop: Shop) => {
    setSelectedShop(shop)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        今天吃什么？
      </h1>
      
      <SpinningWheel shops={shops} onSpinEnd={handleSpinEnd} />
      
      {selectedShop && (
        <div className="mt-12 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-700 dark:text-gray-200">
            推荐餐厅
          </h2>
          <ShopCard shop={selectedShop} />
        </div>
      )}
    </div>
  )
} 