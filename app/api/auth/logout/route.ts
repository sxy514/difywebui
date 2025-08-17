import { NextResponse } from 'next/server'

export async function POST() {
    // 创建响应
    const response = NextResponse.json({ message: 'Logout successful' })

    // 清除认证cookie
    response.cookies.delete('auth_token')

    return response
}
