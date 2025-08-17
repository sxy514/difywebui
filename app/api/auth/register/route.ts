import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/service/prisma'

export async function POST(req: Request) {
    // 添加注册开关检查
    if (process.env.DISABLE_REGISTRATION === 'true') {
        return NextResponse.json(
            { error: '新用户注册已关闭' },
            { status: 403 },
        )
    }

    try {
        const { username, email, password } = await req.json()
        console.log('Register request received:', { username, email })

        // 检查用户是否存在
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        })

        if (existingUser) {
            console.error('Registration failed: User already exists', { username, email })
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        // 哈希密码
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        console.log('Password hashed for user:', username)

        // 创建用户
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            },
        })

        if (!newUser) {
            console.error('User creation failed:', { username, email })
            return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
        }

        console.log('User created successfully:', {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        })

        return NextResponse.json({
            message: 'User registered successfully',
            user: { id: newUser.id, username: newUser.username, email: newUser.email },
        })
    }
    catch (err) {
        // 简化错误类型断言
        const error = err as Error
        console.error('Registration error details:', error)
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message,
        }, { status: 500 })
    }
}
