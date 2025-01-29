import Image from 'next/image'
import { Shop } from '@prisma/client'

interface ShopCardProps {
  shop: Shop
}

export default function ShopCard({ shop }: ShopCardProps) {
  const priceSymbol = '¥'.repeat(shop.priceLevel)
  const images = JSON.parse(shop.images as string) as string[]
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={images[0] || '/images/shops/default/placeholder.jpg'}
          alt={shop.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-sm">
          {shop.type}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
          <span className="text-yellow-500">★ {shop.rating.toFixed(1)}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{shop.address}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">{priceSymbol}</span>
          <span className={`text-sm px-2 py-1 rounded ${
            shop.status === 'OPEN' 
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}>
            {shop.status === 'OPEN' ? '营业中' : '已关闭'}
          </span>
        </div>
      </div>
    </div>
  )
} 