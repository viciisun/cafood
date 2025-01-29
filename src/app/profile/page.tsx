'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Shop } from '@prisma/client'
import ShopCard from '@/components/ShopCard'
import FloatingActionButton from '@/components/FloatingActionButton'

interface User {
  id: string
  username: string
  email: string
  role: string
  image?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [userShops, setUserShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          router.push('/')
          return
        }
        const data = await response.json()
        setUser(data.user)

        // 获取用户创建的商店
        const shopsResponse = await fetch('/api/shops/user')
        if (shopsResponse.ok) {
          const shopsData = await shopsResponse.json()
          setUserShops(shopsData)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">加载中...</div>
      </div>
    )
  }

  const actions = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      ),
      label: '退出登录',
      onClick: async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/')
      },
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      ),
      label: '编辑资料',
      onClick: () => {
        // TODO: 实现编辑资料功能
        console.log('Edit profile')
      },
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FloatingActionButton
        mainIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        }
        actions={actions}
        position="top-right"
        direction="down"
      />

      {/* 内容区域添加 padding */}
      <div className="p-4">
        {/* 用户信息 */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20">
                <Image
                  src={user?.image || '/images/avatar-placeholder.png'}
                  alt={user?.username || '用户头像'}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.username}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {user?.role === 'ADMIN' ? '管理员' : '普通用户'}
                </p>
              </div>
            </div>
          </div>

          {/* 用户创建的商店 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              我创建的商店
            </h2>
            {userShops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userShops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <p className="text-gray-600 dark:text-gray-400">
                  你还没有创建任何商店
                </p>
                <button
                  onClick={() => router.push('/main/add')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  创建商店
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 