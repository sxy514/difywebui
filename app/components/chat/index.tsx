'use client'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Textarea from 'rc-textarea'
import s from './style.module.css'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Tooltip from '@/app/components/base/tooltip'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'

export type IChatProps = {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const queryRef = useRef('')

  const handleContentChange = (e: any) => {
    const value = e.target.value
    setQuery(value)
    queryRef.current = value
  }

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    const query = queryRef.current
    if (!query || query.trim() === '') {
      logError(t('app.errorMessage.valueOfVarRequired'))
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery) {
      setQuery('')
      queryRef.current = ''
    }
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend()))
      return
    onSend(queryRef.current, files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    })))
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length)
        onClear()
      if (!isResponding) {
        setQuery('')
        queryRef.current = ''
      }
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      const result = query.replace(/\n$/, '')
      setQuery(result)
      queryRef.current = result
      e.preventDefault()
    }
  }

  const suggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    queryRef.current = suggestion
    handleSend()
  }

  return (
    <div className='h-full w-full px-4'>
      <div className='h-full w-full flex flex-col max-w-5xl mx-auto'>
        <div className='flex-1 w-full overflow-y-auto custom-scrollbar py-4 space-y-6'>
          {chatList.map((item) => {
            if (item.isAnswer) {
              const isLast = item.id === chatList[chatList.length - 1].id
              return (
                <Answer
                  key={item.id}
                  item={item}
                  feedbackDisabled={feedbackDisabled}
                  onFeedback={onFeedback}
                  isResponding={isResponding && isLast}
                  suggestionClick={suggestionClick}
                />
              )
            }
            return (
              <Question
                key={item.id}
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
              />
            )
          })}
        </div>
        {!isHideSendInput && (
          <div className={cn('sticky bottom-0 bg-gradient-to-t from-white to-white/80 backdrop-blur-sm pt-4 pb-6', !feedbackDisabled && 'px-1')}>
            <div className='relative max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl'>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-30'></div>
              {visionConfig?.enabled && (
                <div className='absolute left-2 bottom-2 flex items-center'>
                  <ChatImageUploader
                    settings={visionConfig}
                    onUpload={onUpload}
                    disabled={files.length >= (visionConfig.number_limits || 1)}
                  />
                  <div className='mx-1 w-[1px] h-4 bg-black/5' />
                </div>
              )}
              <div className='relative px-4 py-3'>
                {visionConfig?.enabled && files.length > 0 && (
                  <div className='mb-2 pl-8'>
                    <ImageList
                      list={files}
                      onRemove={onRemove}
                      onReUpload={onReUpload}
                      onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                      onImageLinkLoadError={onImageLinkLoadError}
                    />
                  </div>
                )}
                <div className='relative flex items-center'>
                  <Textarea
                    className={`
                      block w-full pr-16 py-2 text-sm text-gray-800 outline-none appearance-none resize-none
                      bg-transparent placeholder-gray-400 focus:ring-0 border-0 transition-all duration-200
                      ${visionConfig?.enabled ? 'pl-10' : 'pl-4'}
                    `}
                    placeholder={t('app.chat.placeholder') || 'Type your message...'}
                    value={query}
                    onChange={handleContentChange}
                    onKeyUp={handleKeyUp}
                    onKeyDown={handleKeyDown}
                    autoSize
                  />
                  <div className='absolute right-0 flex items-center space-x-1'>
                    <div className={`text-xs text-gray-400 mr-2 ${!query.trim() ? 'invisible' : ''}`}>
                      {query.trim().length}
                    </div>
                    <Tooltip
                      selector='send-tip'
                      htmlContent={
                        <div className='text-xs'>
                          <div>{t('common.operation.send')} Enter</div>
                          <div>{t('common.operation.lineBreak')} Shift + Enter</div>
                        </div>
                      }
                    >
                      <button
                        className={cn(
                          'flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200',
                          !query.trim() 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
                          isResponding && 'bg-blue-400 cursor-wait'
                        )}
                        disabled={!query.trim() || isResponding}
                        onClick={handleSend}
                      >
                        {isResponding ? (
                          <div className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.33301 1.3335L7.33301 7.3335M7.33301 7.3335L1.33301 13.3335M7.33301 7.3335L1.33301 7.3335M15.333 7.3335L9.33301 7.3335M9.33301 7.3335L15.333 1.3335M9.33301 7.3335L15.333 13.3335" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(Chat)
