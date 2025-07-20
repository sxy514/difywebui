import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import styles from './style.module.css'

export const Markdown = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1] : 'text'

                    return !inline
                        ? (
                            <div data-v-cad61513 data-v-3a4aba44 className="segment-code markdown-code">
                                <header data-v-cad61513 className="segment-code-header">
                                    <div className={styles.codeTitle}>{language.toUpperCase()}</div>
                                    <button
                                        className={styles.copyButton}
                                        onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                                        title="复制代码"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                        </svg>
                                    </button>
                                </header>
                                <div data-v-cad61513 className="segment-code-content">
                                    <SyntaxHighlighter
                                        style={vscDarkPlus as any}
                                        language={language}
                                        PreTag="pre"
                                        showLineNumbers
                                        lineNumberStyle={{ color: '#6b7280', minWidth: '2.25em', paddingRight: '1em', textAlign: 'right', userSelect: 'none' }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        )
                        : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                },
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
