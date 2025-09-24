import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './login-form.module.css'

type LoginFormProps = {
  onLoginSuccess?: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        if (onLoginSuccess)
          onLoginSuccess()
        else
          router.push('/chat')
      }
      else {
        const errorData = await response.json()
        setError(errorData.error || '登录失败')
      }
    }
    catch (err) {
      setError('网络请求失败')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.formLabel}>
                    用户名
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className={styles.formInput}
          placeholder="请输入用户名"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.formLabel}>
                    密码
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.formInput}
          placeholder="请输入密码"
          required
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`${styles.submitButton} ${loading ? styles.loadingButton : ''}`}
      >
        {loading
          ? (
            <span className={styles.loadingContainer}>
              <svg className={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
                            登录中...
            </span>
          )
          : '登录'}
      </button>

      <div className={styles.registerLink}>
                没有账号？{' '}
        <a href="/register" className={styles.registerAnchor}>
                    立即注册
        </a>
      </div>
    </form>
  )
}
