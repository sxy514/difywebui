'use client'
import { useRouter } from 'next/navigation'
import LoginForm from '../components/auth/login-form'
import { AuthProvider } from '../context/auth-context'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = () => {
    // 登录成功后跳转到聊天页面
    router.push('/chat')
  }

  return (
    <AuthProvider>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.title}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
              <h1 className={styles.titleText}>欢迎登录</h1>
            </div>
          </div>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    </AuthProvider>
  )
}
