import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
export type IHeaderProps = {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
      <div className='flex items-center space-x-4'>
        {isMobile && (
          <button
            onClick={() => onShowSideBar?.()}
            className="p-2 rounded-lg hover:bg-blue-700/30 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-6 w-6 text-white" />
          </button>
        )}
        <div className='flex items-center space-x-3'>
          {/* <AppIcon size="small" /> */}
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            {title}
          </h1>
        </div>
      </div>

      {isMobile && (
        <button
          onClick={() => onCreateNewChat?.()}
          className="p-2 rounded-lg hover:bg-blue-700/30 transition-all duration-200"
          aria-label="New chat"
        >
          <PencilSquareIcon className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  )
}

export default React.memo(Header)
