import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sign } from 'jsonwebtoken'

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: '请填写所有必填字段' },
                { status: 400 }
            )
        }

        // 查找用户
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: '用户不存在' },
                { status: 401 }
            )
        }

        // 验证密码
        const isValid = await compare(password, user.password)
        if (!isValid) {
            return NextResponse.json(
                { error: '密码错误' },
                { status: 401 }
            )
        }

        // 创建 JWT token
        const token = sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
        )

        // 设置 cookie
        const response = NextResponse.json(
            { message: '登录成功', user: { id: user.id, username: user.username, role: user.role } },
            { status: 200 }
        )
        
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 // 24 hours
        })

        return response
    } catch (error) {
        return NextResponse.json(
            { error: '登录失败' },
            { status: 500 }
        )
    }
} 