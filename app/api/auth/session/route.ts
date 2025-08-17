import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    // 从cookie获取用户信息
    const cookie = req.headers.get('cookie') || ''
    console.log('原始cookie:', cookie)

    // 改进的cookie解析逻辑
    const sessionCookie = cookie
      .split(';')
      .map(c => c.trim())
      .find(c => c.startsWith('user_session='))

    if (!sessionCookie) {
      console.log('未找到user_session cookie')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 获取cookie值
    let cookieValue = sessionCookie.split('=')[1]
    console.log('原始cookie值:', cookieValue)

    // 双重解码URL编码值
    cookieValue = decodeURIComponent(cookieValue) // 第一次解码
    cookieValue = decodeURIComponent(cookieValue) // 第二次解码

    console.log('双重解码后值:', cookieValue)

    // 解析JSON数据
    const user = JSON.parse(cookieValue)
    console.log('解析后的用户数据:', user)

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  }
  catch (err) {
    console.error('Session API错误详情:', err)
    return NextResponse.json(
      { error: 'Invalid session format', details: err instanceof Error ? err.message : String(err) },
      { status: 401 },
    )
  }
}
