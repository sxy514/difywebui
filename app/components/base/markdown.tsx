import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import 'katex/dist/katex.min.css'
import { CheckIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import RemarkMath from 'remark-math'
import RemarkBreaks from 'remark-breaks'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import './markdown.css'

import EChart from './echart'

// CopyButton component
const CopyButton = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(content)
      }
      else {
        const textArea = document.createElement('textarea')
        textArea.value = content
        textArea.style.position = 'fixed'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (!successful)
          throw new Error('Failed to copy')
      }

      setCopied(true)
      if (timerRef.current)
        clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    }
    catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      className="simple-button size-medium bg-white border border-gray-300 rounded-md flex items-center gap-1 px-2 py-1 text-sm hover:bg-gray-50 transition-colors text-gray-700"
      onClick={handleCopy}
      title={copied ? '已复制' : '复制代码'}
      aria-label={copied ? '已复制' : '复制代码'}
    >
      {copied
        ? (
          <CheckIcon className="w-4 h-4 text-green-600" />
        )
        : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024" className="iconify">
            <path d="M427.04896 379.12576a60.2112 60.2112 0 0 0-60.2112 60.2112v315.51488a60.2112 60.2112 0 0 0 60.2112 60.25216h315.51488a60.2112 60.2112 0 0 0 60.25216-60.2112v-315.55584a60.2112 60.2112 0 0 0-60.2112-60.2112H427.008z m-94.74048-34.48832a133.9392 133.9392 0 0 1 94.74048-39.23968h315.51488a133.98016 133.98016 0 0 1 133.98016 133.9392v315.51488a133.9392 133.9392 0 0 1-133.9392 133.98016H427.008a133.9392 133.9392 0 0 1-133.9392-133.9392v-315.55584c0-35.51232 14.09024-69.632 39.23968-94.69952z" fill="currentColor"></path>
            <path d="M257.14688 233.472a36.16768 36.16768 0 0 0-35.96288 35.96288v364.05248a35.96288 35.96288 0 0 0 18.18624 31.21152 36.864 36.864 0 1 1-36.41344 64.1024A109.64992 109.64992 0 0 1 147.456 633.56928v-364.1344A109.89568 109.89568 0 0 1 257.14688 159.744h364.09344c20.56192 0 38.87104 5.48864 54.51776 16.83456 14.86848 10.77248 24.82176 25.10848 32.31744 38.5024a36.864 36.864 0 0 1-64.47104 35.84c-4.95616-8.97024-8.6016-12.86144-11.14112-14.66368-1.72032-1.2288-4.5056-2.78528-11.22304-2.78528h-364.1344z" fill="currentColor"></path>
          </svg>
        )}
    </button>
  )
}

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
function ThinkBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`my-2 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg overflow-hidden ${className || ''}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-2 flex items-center gap-2 text-blue-700 hover:bg-blue-100 transition-colors"
      >
        {isExpanded
          ? (
            <ChevronDownIcon className="w-4 h-4" />
          )
          : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
        <span className="text-sm font-medium">Thinking</span>
      </button>
      {isExpanded && (
        <div className="p-3 text-sm text-gray-700 bg-white prose prose-sm max-w-none">
          {children}
        </div>
      )}
    </div>
  )
}

// Component for rendering the final answer
function FinalAnswer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`my-3 p-3 bg-green-50 border-l-4 border-green-300 rounded-r ${className || ''}`}>
      <div className="text-sm font-medium text-green-800 mb-1">Final Answer:</div>
      <div className="text-gray-800 prose prose-sm max-w-none">{children}</div>
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
  messageFiles = [],
  className,
}: {
  content: string
  messageFiles?: MessageFile[]
  className?: string
}) {
  // Process content to extract think tags and final answer
  const processContent = (content: string) => {
    // Check if content contains think tags
    if (!content.includes('<think>'))
      return content // Return as is if no think tags

    // Split content into think blocks and final answer
    const thinkBlocks: string[] = []
    let finalAnswer = content

    // Extract all think blocks
    const thinkRegex = /<think>([\s\S]*?)<\/think>/g
    let match
    do {
      match = thinkRegex.exec(content)
      if (match) {
        thinkBlocks.push(match[1])
        // Replace the think block with a marker
        finalAnswer = finalAnswer.replace(match[0], '')
      }
    } while (match)

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
                      return (!inline && match)
                        ? (
                          <div className="segment-code markdown-code">
                            <header className="segment-code-header" style={{ position: 'sticky', left: 0, top: 0, zIndex: 10, background: 'white' }}>
                              <div className="segment-code-header-content flex justify-between items-center p-2 border-b border-gray-200">
                                <span className="segment-code-lang text-xs font-medium text-gray-600 capitalize">{match[1].charAt(0).toUpperCase() + match[1].slice(1)}</span>
                                <CopyButton content={String(children).replace(/\n$/, '')} />
                              </div>
                            </header>
                            <div className="syntax-highlighter light segment-code-content">
                              <SyntaxHighlighter
                                {...props}
                                className={`language-${match[1]}`}
                                language={match[1]}
                                style={prism}
                                showLineNumbers={false}
                                customStyle={{
                                  background: 'transparent',
                                  color: '#333333',
                                  fontSize: '0.875rem',
                                  lineHeight: 1.5,
                                  margin: 0,
                                  padding: 0,
                                  borderRadius: 0,
                                  overflow: 'auto',
                                  maxWidth: '100%',
                                }}
                                codeTagProps={{
                                  style: {
                                    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                    background: 'transparent',
                                  },
                                }}
                                wrapLines={false}
                                wrapLongLines={false}
                                PreTag="pre"
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        )
                        : (
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
          <FinalAnswer className="prose prose-sm">
            <ReactMarkdown
              remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
              rehypePlugins={[RehypeKatex]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return (!inline && match)
                    ? (
                      <div className="segment-code markdown-code">
                        <header className="segment-code-header" style={{ position: 'sticky', left: 0, top: 0, zIndex: 10, background: 'white' }}>
                          <div className="segment-code-header-content flex justify-between items-center p-2 border-b border-gray-200">
                            <span className="segment-code-lang text-xs font-medium text-gray-600 capitalize">{match[1].charAt(0).toUpperCase() + match[1].slice(1)}</span>
                            <CopyButton content={String(children).replace(/\n$/, '')} />
                          </div>
                        </header>
                        <div className="syntax-highlighter light segment-code-content">
                          <SyntaxHighlighter
                            {...props}
                            className={`language-${match[1]}`}
                            language={match[1]}
                            style={prism}
                            showLineNumbers={false}
                            customStyle={{
                              background: 'transparent',
                              color: '#333333',
                              fontSize: '0.875rem',
                              lineHeight: 1.5,
                              margin: 0,
                              padding: 0,
                              borderRadius: 0,
                              overflow: 'auto',
                              maxWidth: '100%',
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                                background: 'transparent',
                              },
                            }}
                            wrapLines={false}
                            wrapLongLines={false}
                            PreTag="pre"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )
                    : (
                      <code {...props} className={className}>
                        {children}
                      </code>
                    )
                },
              }}
              linkTarget={'_blank'}
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
    file.type === 'image' && file.belongs_to === 'assistant',
  )

  const allImageFiles = [...messageImageFiles, ...contentImageUrls]

  // If no think tags, render normally
  if (!content.includes('<think>')) {
    return (
      <div className={`markdown-body ${className || ''}`}>
        <ReactMarkdown
          remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
          rehypePlugins={[RehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              if (!inline && match && match[1] === 'json') {
                try {
                  const codeContent = String(children).replace(/\n$/, '').trim()
                  const parsed = JSON.parse(codeContent)
                  // Check if it's a valid EChart option (has series or xAxis/yAxis)
                  if (parsed && (parsed.series || (parsed.xAxis && parsed.yAxis))) {
                    return (
                      <div className="segment-code markdown-code my-4">
                        <header className="segment-code-header" style={{ position: 'sticky', left: 0, top: 0, zIndex: 10, background: 'white' }}>
                          <div className="segment-code-header-content flex justify-between items-center p-2 border-b border-gray-200">
                            <span className="segment-code-lang text-xs font-medium text-gray-600 capitalize">EChart</span>
                            <CopyButton content={codeContent} />
                          </div>
                        </header>
                        <div className="echart-container w-full h-96 bg-white rounded-b border border-gray-200">
                          <EChart option={parsed} style={{ width: '100%', height: '100%' }} />
                        </div>
                      </div>
                    )
                  }
                }
                catch (error) {
                  // If parsing fails, fallback to syntax highlighting
                }
              }
              return (!inline && match)
                ? (
                  <div className="segment-code markdown-code">
                    <header className="segment-code-header" style={{ position: 'sticky', left: 0, top: 0, zIndex: 10, background: 'white' }}>
                      <div className="segment-code-header-content flex justify-between items-center p-2 border-b border-gray-200">
                        <span className="segment-code-lang text-xs font-medium text-gray-600 capitalize">{match[1].charAt(0).toUpperCase() + match[1].slice(1)}</span>
                        <CopyButton content={String(children).replace(/\n$/, '')} />
                      </div>
                    </header>
                    <div className="syntax-highlighter light segment-code-content">
                      <SyntaxHighlighter
                        {...props}
                        className={`language-${match[1]}`}
                        language={match[1]}
                        style={prism}
                        showLineNumbers={false}
                        customStyle={{
                          background: 'transparent',
                          color: '#333333',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          margin: 0,
                          padding: 0,
                          borderRadius: 0,
                          overflow: 'auto',
                          maxWidth: '100%',
                        }}
                        codeTagProps={{
                          style: {
                            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                            background: 'transparent',
                          },
                        }}
                        wrapLines={false}
                        wrapLongLines={false}
                        PreTag="pre"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )
                : (
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
    <div className={`markdown-body ${className || ''}`}>
      {processedContent}
      {allImageFiles.map((file, index) => (
        <ImageFile key={`${file.url}-${index}`} file={file} />
      ))}
    </div>
  )
}
