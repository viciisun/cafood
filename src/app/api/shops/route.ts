import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const shops = await prisma.shop.findMany()
    return NextResponse.json(shops)
  } catch (error) {
    return NextResponse.json(
      { error: '获取商店列表失败' },
      { status: 500 }
    )
  }
} 