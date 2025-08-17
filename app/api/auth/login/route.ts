import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/service/prisma'

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    })

    // 用户不存在或密码哈希不存在
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      )
    }

    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      )
    }

    // 设置包含用户信息的cookie
    const userData = JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
    })

    const response = NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email },
    })

    response.cookies.set('user_session', userData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 仅在生产环境使用HTTPS
      maxAge: 60 * 60 * 24, // 1天
      path: '/',
    })

    return response
  }
  catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : '',
      },
      { status: 500 },
    )
  }
}
