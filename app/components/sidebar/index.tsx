import React from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronLeftIcon,
  ClockIcon,
  CogIcon,
  EllipsisVerticalIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PhoneIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatBubbleOvalLeftEllipsisSolidIcon } from '@heroicons/react/24/solid'
import type { ConversationItem } from '@/types/app'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export type ISidebarProps = {
  copyRight: string
  currentId: string
  onCurrentIdChange: (id: string) => void
  onDeleteConversation?: (id: string) => void
  list: ConversationItem[]
}

const Sidebar: FC<ISidebarProps> = ({
  copyRight,
  currentId,
  onCurrentIdChange,
  onDeleteConversation,
  list,
}) => {
  const { t } = useTranslation()
  return (
    <div
      className="shrink-0 flex flex-col h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white w-72 border-r border-blue-700/50"
    >
      <div className="sidebar-header p-4 border-b border-blue-700/50 flex-shrink-0 flex items-center justify-between">
        <a href="#" className="logo">
          <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 text-white" />
        </a>
        <div className="expand-btn">
          <ChevronLeftIcon className="h-5 w-5 text-white/70 hover:text-white cursor-pointer" />
        </div>
      </div>
      <div className="sidebar-nav p-4 border-b border-blue-700/50 flex-shrink-0">
        <a
          href="#"
          onClick={() => onCurrentIdChange('-1')}
          className="new-chat-btn flex items-center justify-between w-full text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 p-3 transition-all duration-200"
        >
          <div className="action-label flex items-center">
            <PlusIcon className="mr-2 h-4 w-4 text-blue-200" />
            <span className="whitespace-nowrap">{t('app.chat.newChat') || '新建会话'}</span>
          </div>
          <div className="action-opts flex items-center text-xs text-blue-300">
            <div className="meta px-1 py-0.5 bg-white/10 rounded">Ctrl</div>
            <span className="meta ml-1">K</span>
          </div>
        </a>
      </div>
      <div className="amhs-plus-part p-4 border-b border-blue-700/50">
        <a href="#" className="nav-item amhs-plus-square flex items-center text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 p-3 transition-all duration-200">
          <StarIcon className="mr-2 h-4 w-4 text-yellow-300" />
          <span>App Market+</span>
        </a>
        <ul className="mt-3 space-y-2">
          <li>
            <a href="#" className="amhs-plus-item flex items-center justify-between w-full rounded-lg hover:bg-white/10 p-2 transition-all">
              <div className="amhs-plus-info flex items-center">
                <div className="amhs-plus-avatar mr-3">
                  <img src="https://kimi-img.moonshot.cn/prod-chat-kimi/avatar/kimiplus/academic.png" alt="学术搜索" className="w-8 h-8 rounded-full" />
                </div>
                <span className="amhs-plus-name text-sm">学术搜索</span>
              </div>
              <div className="more-btn">
                <EllipsisVerticalIcon className="h-4 w-4 text-white/70 hover:text-white cursor-pointer" />
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="amhs-plus-item flex items-center justify-between w-full rounded-lg hover:bg-white/10 p-2 transition-all">
              <div className="amhs-plus-info flex items-center">
                <div className="amhs-plus-avatar mr-3">
                  <img src="https://kimi-img.moonshot.cn/prod-chat-kimi/avatar/kimiplus/translate.png" alt="翻译通" className="w-8 h-8 rounded-full" />
                </div>
                <span className="amhs-plus-name text-sm">翻译通</span>
              </div>
              <div className="more-btn">
                <EllipsisVerticalIcon className="h-4 w-4 text-white/70 hover:text-white cursor-pointer" />
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="amhs-plus-item flex items-center justify-between w-full rounded-lg hover:bg-white/10 p-2 transition-all">
              <div className="amhs-plus-info flex items-center">
                <div className="amhs-plus-avatar mr-3">
                  <img src="https://kimi-img.moonshot.cn/prod-chat-kimi/avatar/kimiplus/medical-search.png" alt="医疗搜索" className="w-8 h-8 rounded-full" />
                </div>
                <span className="amhs-plus-name text-sm">医疗搜索</span>
              </div>
              <div className="more-btn">
                <EllipsisVerticalIcon className="h-4 w-4 text-white/70 hover:text-white cursor-pointer" />
              </div>
            </a>
          </li>
          <li>
            <a href="#" className="amhs-plus-item flex items-center justify-between w-full rounded-lg hover:bg-white/10 p-2 transition-all">
              <div className="amhs-plus-info flex items-center">
                <div className="amhs-plus-avatar mr-3">
                  <img src="https://kimi-img.moonshot.cn/prod-chat-kimi/avatar/kimiplus/新PPT助手.png" alt="PPT 助手" className="w-8 h-8 rounded-full" />
                </div>
                <span className="amhs-plus-name text-sm">PPT 助手</span>
              </div>
              <div className="more-btn">
                <EllipsisVerticalIcon className="h-4 w-4 text-white/70 hover:text-white cursor-pointer" />
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div className="history-part flex-1 overflow-y-auto custom-scrollbar">
        <div className="nav-title p-4 border-b border-blue-700/50">
          <div className="title-label flex items-center text-sm font-medium pl-3">
            <ClockIcon className="mr-2 h-5 w-5" />
            <span>{'历史会话'}</span>
          </div>
        </div>
        <ul className="p-4 space-y-1">
          {list.map((item) => {
            const isCurrent = item.id === currentId
            const ItemIcon = isCurrent ? ChatBubbleOvalLeftEllipsisSolidIcon : ChatBubbleOvalLeftEllipsisIcon

            return (
              <li key={item.id}>
                <div
                  onClick={() => onCurrentIdChange(item.id)}
                  className={classNames(
                    isCurrent
                      ? 'bg-blue-700/80 text-white shadow-md'
                      : 'text-blue-100 hover:bg-blue-700/50',
                    'group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition-all duration-200 hover:pl-4',
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
                  <span className="truncate flex-1">{item.name}</span>
                  {onDeleteConversation && item.id !== '-1' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('你确定要删除这个会话吗?'))
                          onDeleteConversation(item.id)
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-blue-700/50"
                      title={t('common.delete') || 'Delete'}
                    >
                      <TrashIcon className="h-4 w-4 text-blue-300" />
                    </button>
                  )}
                  <div className="more-btn ml-2 opacity-0 group-hover:opacity-100">
                    <EllipsisVerticalIcon className="h-4 w-4 text-blue-300 cursor-pointer" />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="sidebar-footer p-4 border-t border-blue-700/50">
        <ul className="user-nav space-y-2 text-sm mb-4" style={{ display: 'none' }}>
          <li className="sub-item flex items-center p-2 rounded hover:bg-white/10 cursor-pointer">
            <PhoneIcon className="mr-2 h-4 w-4" />
            <span>下载手机应用</span>
          </li>
          <li className="sub-item flex items-center p-2 rounded hover:bg-white/10 cursor-pointer">
            <InformationCircleIcon className="mr-2 h-4 w-4" />
            <span>关于我们</span>
          </li>
          <li className="sub-item language-switch flex items-center p-2 rounded hover:bg-white/10 cursor-pointer">
            <GlobeAltIcon className="mr-2 h-4 w-4" />
            <span>Language</span>
          </li>
          <li className="sub-item flex items-center p-2 rounded hover:bg-white/10 cursor-pointer">
            <ChatBubbleLeftIcon className="mr-2 h-4 w-4" />
            <span>用户反馈</span>
          </li>
          <li className="sub-item">
            <a href="/settings" className="flex items-center p-2 rounded hover:bg-white/10">
              <CogIcon className="mr-2 h-4 w-4" />
              <span>设置</span>
            </a>
          </li>
        </ul>
        <div className="text-gray-400 font-normal text-xs mt-4 text-center">© {copyRight} {(new Date()).getFullYear()}</div>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
