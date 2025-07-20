import React, { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark, vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import 'katex/dist/katex.min.css'
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline'

// CopyButton component
const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 p-1.5 rounded-md bg-gray-700 bg-opacity-70 text-gray-200 hover:bg-opacity-100 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
      title="Copy code"
      aria-label="Copy code"
    >
      {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
    </button>
  )
}

import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { getFileExtension } from '@/app/components/base/file-uploader-in-attachment/utils'
import { SupportUploadFileTypes } from '@/app/components/base/file-uploader-in-attachment/types'
import './markdown.css'

export type MessageFile = {
  id?: string
  type: string
  transfer_method?: string
  url: string
  upload_file_id?: string
  belongs_to?: string
  // Optional fields for compatibility with different API responses
  event?: string
  conversation_id?: string
}

// Component for rendering think blocks with collapsible functionality
function ThinkBlock({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="my-2 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-2 flex items-center gap-2 text-blue-700 hover:bg-blue-100 transition-colors"
      >
        {isExpanded ? (
          <ChevronDownIcon className="w-4 h-4" />
        ) : (
          <ChevronRightIcon className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">Thinking</span>
      </button>
      {isExpanded && (
        <div className="p-3 text-sm text-gray-700 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

// Component for rendering the final answer
function FinalAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 p-3 bg-green-50 border-l-4 border-green-300 rounded-r">
      <div className="text-sm font-medium text-green-800 mb-1">Final Answer:</div>
      <div className="text-gray-800">{children}</div>
    </div>
  )
}

// Component to display image files from model responses
function ImageFile({ file }: { file: MessageFile }) {
  const [error, setError] = useState('')

  if (!file || !file.url) {
    return (
      <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
        <div className="font-medium">图片加载失败</div>
        <div>无效的图片URL</div>
      </div>
    )
  }



  const apiBaseUrl = process.env.NEXT_BASE_URL || 'http://192.168.0.110'
  const correctedUrl = apiBaseUrl + file.url

  return (
    <div className="my-2 max-w-full relative group">
      <div className="relative">
        <img
          src={correctedUrl}
          alt="Generated content"
          className="max-h-[500px] max-w-full rounded-md border border-gray-200 object-contain"
          onError={() => setError('图片加载失败')}
        />
        {error && (
          <div className="absolute inset-0 bg-red-50 text-red-600 rounded-md flex items-center justify-center">
            {error}
          </div>
        )}
        <a
          href={correctedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-black/50 text-white p-1.5 rounded hover:bg-black/70 transition-all"
          title="在新标签页中打开"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  )
}

export function Markdown({
  content,
  messageFiles = []
}: {
  content: string
  messageFiles?: MessageFile[]
}) {
  // Process content to extract think tags and final answer
  const processContent = (content: string) => {
    // Check if content contains think tags
    if (!content.includes('<think>')) {
      return content // Return as is if no think tags
    }

    // Split content into think blocks and final answer
    const thinkBlocks: string[] = []
    let finalAnswer = content

    // Extract all think blocks
    const thinkRegex = /<think>([\s\S]*?)<\/think>/g
    let match
    while ((match = thinkRegex.exec(content)) !== null) {
      thinkBlocks.push(match[1])
      // Replace the think block with a marker
      finalAnswer = finalAnswer.replace(match[0], '')
    }

    // Remove empty lines and trim
    finalAnswer = finalAnswer.replace(/^\s*[\r\n]/gm, '').trim()

    return (
      <>
        {thinkBlocks.length > 0 && (
          <ThinkBlock>
            {thinkBlocks.map((block, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <ReactMarkdown
                  remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
                  rehypePlugins={[RehypeKatex]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="syntax-highlighter-wrapper">
                          <SyntaxHighlighter
                            {...props}
                            language={match[1]}
                            style={vscDarkPlus}
                            showLineNumbers
                            customStyle={{
                              background: '#1e1e1e',
                              fontSize: '1.1em',
                              lineHeight: 1.5,
                              margin: 0,
                              padding: '1em',
                              borderRadius: '6px',
                              overflow: 'auto'
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                background: 'transparent'
                              }
                            }}
                            wrapLines={false}
                            wrapLongLines={false}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {block}
                </ReactMarkdown>
              </div>
            ))}
          </ThinkBlock>
        )}
        {finalAnswer && (
          <FinalAnswer>
            <ReactMarkdown
              remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
              rehypePlugins={[RehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className="syntax-highlighter-wrapper relative group">
                      <CopyButton content={String(children).replace(/\n$/, '')} />
                      <SyntaxHighlighter
                        {...props}
                        language={match[1]}
                        style={atomDark}
                        customStyle={{
                          background: '#1e1e1e',
                          fontSize: '1.1em',
                          lineHeight: 1.5,
                          margin: 0,
                          padding: '1em',
                          borderRadius: '6px',
                          overflow: 'auto'
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {finalAnswer}
            </ReactMarkdown>
          </FinalAnswer>
        )}
      </>
    )
  }

  // Extract image URLs from content and combine with message files
  const contentImageUrls = (content.match(/https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp)/gi) || [])
    .map(url => ({ url, type: 'image', belongs_to: 'assistant' } as MessageFile))

  const messageImageFiles = messageFiles.filter(file =>
    file.type === 'image' && file.belongs_to === 'assistant'
  )

  const allImageFiles = [...messageImageFiles, ...contentImageUrls]

  // If no think tags, render normally
  if (!content.includes('<think>')) {
    return (
      <div className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
          rehypePlugins={[RehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="syntax-highlighter-wrapper relative group">
                  <CopyButton content={String(children).replace(/\n$/, '')} />
                  <SyntaxHighlighter
                    {...props}
                    language={match[1]}
                    style={vscDarkPlus}
                    showLineNumbers
                    customStyle={{
                      background: '#ffffff',
                      color: '#333333',
                      fontSize: '1.3em',
                      lineHeight: 1.5,
                      margin: 0,
                      padding: '1em',
                      borderRadius: '6px',
                      overflowX: 'hidden',
                      overflowY: 'auto',
                      maxWidth: '100%',
                      border: '1px solid #eaeaea'
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                        background: 'transparent',
                        fontSize: '1.1em !important'
                      }
                    }}
                    wrapLines={false}
                    wrapLongLines={false}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
            },
          }}
          linkTarget={'_blank'}
        >
          {content}
        </ReactMarkdown>
        {allImageFiles.map((file, index) => (
          <ImageFile key={`${file.url}-${index}`} file={file} />
        ))}
      </div>
    )
  }

  // Process content with think tags
  const processedContent = processContent(content)

  return (
    <div className="markdown-body">
      {processedContent}
      {allImageFiles.map((file, index) => (
        <ImageFile key={`${file.url}-${index}`} file={file} />
      ))}
    </div>
  )
}
