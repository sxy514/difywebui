import type { FC, MouseEventHandler } from 'react'
import React from 'react'
import Spinner from '@/app/components/base/spinner'

export type IButtonProps = {
  type?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Button: FC<IButtonProps> = ({
  type,
  disabled,
  children,
  className,
  onClick,
  loading = false,
}) => {
  let style = 'cursor-pointer transition-colors duration-200'
  switch (type) {
    case 'link':
      style = disabled 
        ? 'text-blue-300 cursor-not-allowed' 
        : 'text-blue-600 hover:text-blue-700 hover:underline'
      break
    case 'primary':
      style = (disabled || loading) 
        ? 'bg-blue-400 cursor-not-allowed text-white' 
        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
      break
    default:
      style = disabled
        ? 'border border-gray-200 bg-gray-100 cursor-not-allowed text-gray-400'
        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow'
      break
  }

  return (
    <div
      className={`flex justify-center items-center content-center h-9 leading-5 rounded-lg px-4 py-2 text-base ${style} ${className && className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
      {/* Spinner is hidden when loading is false */}
      <Spinner loading={loading} className='!text-white !h-3 !w-3 !border-2 !ml-1' />
    </div>
  )
}

export default React.memo(Button)
