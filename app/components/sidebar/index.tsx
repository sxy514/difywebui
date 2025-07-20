import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/app/components/base/button'
// import Card from './card'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const MAX_CONVERSATION_LENTH = 20

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  list,
}) => {
  const { t } = useTranslation()
  return (
    <div
      className="shrink-0 flex flex-col h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white w-72 border-r border-blue-700/50"
    >
      <div className="p-4 border-b border-blue-700/50 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white/90 mb-4">Conversations</h2>
        {list.length < MAX_CONVERSATION_LENTH && (
          <Button
            onClick={() => { onCurrentIdChange('-1') }}
            className="w-full !justify-start !h-10 bg-white hover:bg-gray-100 text-blue-800 items-center text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <PencilSquareIcon className="mr-2 h-4 w-4" /> 
            <span className="whitespace-nowrap">{t('app.chat.newChat')}</span>
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
        <nav className="p-2 space-y-1">
          {list.map((item) => {
            const isCurrent = item.id === currentId
            const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon

            return (
              <div
                onClick={() => onCurrentIdChange(item.id)}
                key={item.id}
                className={classNames(
                  isCurrent
                    ? 'bg-blue-700/80 text-white shadow-md'
                    : 'text-blue-100 hover:bg-blue-700/50',
                  'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-all duration-200 hover:pl-4',
                )}
                title={item.name}
              >
                <ItemIcon
                  className={classNames(
                    isCurrent ? 'text-blue-300' : 'text-blue-400 group-hover:text-blue-200',
                    'mr-3 h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </div>
            )
          })}
        </nav>
      </div>
      {/* <a className="flex flex-shrink-0 p-4" href="https://langgenius.ai/" target="_blank">
        <Card><div className="flex flex-row items-center"><ChatBubbleOvalLeftEllipsisSolidIcon className="text-primary-600 h-6 w-6 mr-2" /><span>LangGenius</span></div></Card>
      </a> */}
      <div className="flex flex-shrink-0 pr-4 pb-4 pl-4">
        <div className="text-gray-400 font-normal text-xs">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
