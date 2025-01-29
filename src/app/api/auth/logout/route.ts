import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  
  const response = NextResponse.json(
    { message: '登出成功' },
    { status: 200 }
  )
  
  response.cookies.delete('token')
  return response
} 