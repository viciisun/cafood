import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
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

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key')
    return NextResponse.json({ user: decoded })
  } catch {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }
} 