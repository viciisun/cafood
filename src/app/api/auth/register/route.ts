import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { email, username, password } = await req.json()
        
        // 验证输入
        if (!email || !username || !password) {
            return NextResponse.json(
                { error: '请填写所有必填字段' },
                { status: 400 }
            )
        }

        // 检查用户是否已存在
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: '用户名或邮箱已存在' },
                { status: 400 }
            )
        }

        // 创建新用户
        const hashedPassword = await hash(password, 12)
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        })

        return NextResponse.json(
            { message: '注册成功', userId: user.id },
            { status: 201 }
        )
    } catch {
        return NextResponse.json(
            { message: '注册失败' },
            { status: 400 }
        )
    }
} 