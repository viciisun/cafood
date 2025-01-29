import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verify, JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload
    
    const shops = await prisma.shop.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const safeShops = shops.map(shop => ({
      ...shop,
      images: shop.images?.toString() === '[object Object]' || !shop.images ? '[]' : shop.images
    }))

    return NextResponse.json(safeShops)
  } catch (error) {
    console.error('Error fetching user shops:', error)
    return NextResponse.json(
      { error: '获取商店列表失败' },
      { status: 500 }
    )
  }
} 