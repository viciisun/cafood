import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { Shop } from '@prisma/client'

export async function GET() {
  try {
    const shops = await prisma.shop.findMany()
    const safeShops = shops.map(shop => ({
      ...shop,
      images: shop.images?.toString() === '[object Object]' || !shop.images ? '[]' : shop.images
    }))
    return NextResponse.json(safeShops)
  } catch {
    return NextResponse.json({ message: '获取商铺列表失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json({ shop: null, error: '未登录' }, { status: 401 })
    }

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key')
    const data = await request.json()

    const shop = await prisma.shop.create({
      data: {
        ...data,
        images: '[]',
        userId: (decoded as any).userId,
      },
    })

    return NextResponse.json({ shop }, { status: 201 })
  } catch (error) {
    console.error('Create shop error:', error)
    return NextResponse.json({ shop: null, error: '创建商店失败' }, { status: 500 })
  }
} 