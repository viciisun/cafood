'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ShopCard from '@/components/ShopCard'
import { Shop } from '@prisma/client'

interface User {
  id: string
  username: string
  role: string
}

export default function MainPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查用户是否已登录
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          router.push('/')
          return
        }
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        router.push('/')
      }
    }

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

    checkAuth()
    fetchShops()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">加载中...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* 顶部导航栏 */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={128}
                height={128}
                className="rounded-full"
              />
              <span className="ml-2 text-xl font-semibold dark:text-white">
                CaFood
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-200">
                {user?.username}
              </span>
              <button
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  router.push('/')
                }}
                className="text-sm bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </main>
    </div>
  )
} 