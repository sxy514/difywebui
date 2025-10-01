'use client'

import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import type { IMainProps } from '@/app/components'
import Main from '@/app/components'

const App: FC<IMainProps> = ({ params }: any) => {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('正在检查会话状态...')

        // 直接调用会话API，无需读取cookie
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        })

        console.log('会话API响应状态:', response.status)

        if (response.ok) {
          const session = await response.json()
          console.log('会话数据:', session)

          if (session.user) {
            console.log('用户已登录，ID:', session.user.id)
            setIsReady(true)
          }
          else {
            console.log('会话中没有用户信息')
            setError('会话中没有用户信息')
          }
        }
        else {
          const errorText = await response.text()
          console.log('会话API返回错误详情:', errorText)
          setError(`会话验证失败: ${response.statusText}`)
        }
      }
      catch (error) {
        console.error('会话验证错误:', error)
        setError(
          `会话验证错误: ${error instanceof Error ? error.message : String(error)}`,
        )
      }
    }

    checkSession()
  }, [])

  if (error) {
    return (
      <div>
        <div>验证错误: {error}</div>
        <div>请检查控制台获取详细信息</div>
      </div>
    )
  }

  if (!isReady)
    return <div>加载中...</div>

  return <Main params={params} />
}

export default React.memo(App)
