'use client'

import Link from 'next/link'
import Image from 'next/image'
import { theme } from '@/theme'
import { usePathname } from 'next/navigation'

interface TabBarProps {
  currentPath?: string
}

export default function TabBar({ currentPath }: TabBarProps) {
  const pathname = usePathname()
  const path = currentPath || pathname || '/main'
  
  const tabs = [
    {
      href: '/main',
      paths: ['/main', '/main/'],
      icon: '/images/shops/default/tab/home.png',
      activeIcon: '/images/shops/default/tab/home-active.png'
    },
    {
      href: '/map',
      paths: ['/map', '/map/'],
      icon: '/images/shops/default/tab/map.png',
      activeIcon: '/images/shops/default/tab/map-active.png'
    },
    {
      href: '/random',
      paths: ['/random', '/random/'],
      icon: '/images/shops/default/tab/slot.png',
      activeIcon: '/images/shops/default/tab/slot-active.png'
    },
    {
      href: '/profile',
      paths: ['/profile', '/profile/'],
      icon: '/images/shops/default/tab/profile.png',
      activeIcon: '/images/shops/default/tab/profile-active.png'
    }
  ]

  const normalizedPath = path.endsWith('/') 
    ? path.slice(0, -1) 
    : path

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200" 
      style={{ paddingBottom: theme.spacing.safeArea.bottom }}
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = tab.paths.some(path => 
            path === normalizedPath || 
            (path.endsWith('/') && path.slice(0, -1) === normalizedPath)
          )
          
          if (process.env.NODE_ENV !== 'production') {
            console.group(`Tab: ${tab.href}`)
            console.log('Normalized path:', normalizedPath)
            console.log('Tab paths:', tab.paths)
            console.log('Is active:', isActive)
            console.groupEnd()
          }
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="p-3"
            >
              <Image
                src={isActive ? tab.activeIcon : tab.icon}
                alt=""
                width={24}
                height={24}
                priority
                className="transition-transform duration-200"
                onError={(e) => {
                  console.error(`Failed to load image: ${e.currentTarget.src}`)
                }}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 