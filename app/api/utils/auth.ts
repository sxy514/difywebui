import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '@/service/prisma'

export async function authMiddleware(req: NextRequest) {
    // 从Authorization头获取token
    const token = req.headers.get('Authorization')?.split(' ')[1]

    if (!token)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        // 验证JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

        // 查询用户是否存在
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, email: true },
        })

        if (!user)
            return NextResponse.json({ error: 'User not found' }, { status: 404 })

        // 将用户信息添加到请求对象（虽然现在改为使用响应头，但保留此处以防其他中间件使用）
        req.user = user

        // 继续请求并传递用户信息（通过响应头）
        const response = NextResponse.next()
        response.headers.set('x-user', JSON.stringify(user))
        return response
    }
    catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
}
