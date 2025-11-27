'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/posts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'

interface AdminEditorProps {
  initialPost?: Post
}

export default function AdminEditor({ initialPost }: AdminEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialPost?.title || '')
  const [content, setContent] = useState(initialPost?.content || '')
  const [summary, setSummary] = useState(initialPost?.summary || '')
  const [tags, setTags] = useState(initialPost?.tags?.join(', ') || '')
  const [coverImage, setCoverImage] = useState(initialPost?.coverImage || '')
  const [pdfFile, setPdfFile] = useState(initialPost?.pdfFile || '')
  const [usePdf, setUsePdf] = useState(!!initialPost?.pdfFile)
  const [seoDescription, setSeoDescription] = useState(initialPost?.seoDescription || '')
  const [published, setPublished] = useState(initialPost?.published ?? false)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Autosave every 30 seconds
  useEffect(() => {
    if (!initialPost || !title || (!content && !usePdf)) return

    const interval = setInterval(() => {
      handleSave(true)
    }, 30000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, summary, tags, coverImage, pdfFile, usePdf, seoDescription, published])

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setPdfFile(data.url)
        setUsePdf(true)
      } else {
        alert('Failed to upload PDF')
      }
    } catch (error) {
      console.error('PDF upload error:', error)
      alert('Error uploading PDF')
    } finally {
      setUploadingPdf(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setCoverImage(data.url)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImagePaste = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const textarea = contentRef.current
        if (!textarea) return
        
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const imageMarkdown = `![Image](${data.url})\n\n`
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end)
        
        setContent(newContent)
        setTimeout(() => {
          textarea.focus()
          const newPos = start + imageMarkdown.length
          textarea.setSelectionRange(newPos, newPos)
        }, 0)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Image paste error:', error)
      alert('Error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const html = e.clipboardData.getData('text/html')
    const plain = e.clipboardData.getData('text/plain')
    const files = e.clipboardData.files
    
    // Handle image paste
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImagePaste(files[0])
      return
    }
    
    let markdown = plain
    
    if (html) {
      // Better HTML to markdown conversion for LinkedIn and other sources
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      
      // Helper function to check if element is bold
      const isBold = (el: Element): boolean => {
        const style = window.getComputedStyle(el)
        const fontWeight = style.fontWeight
        const isBoldTag = el.tagName === 'STRONG' || el.tagName === 'B'
        const isBoldStyle = fontWeight === 'bold' || fontWeight === '700' || parseInt(fontWeight) >= 600
        const hasBoldClass = el.className && /bold|strong|font-weight|fw-/.test(el.className.toLowerCase())
        return isBoldTag || isBoldStyle || hasBoldClass
      }
      
      // Helper function to check if element is italic
      const isItalic = (el: Element): boolean => {
        const style = window.getComputedStyle(el)
        const fontStyle = style.fontStyle
        const isItalicTag = el.tagName === 'EM' || el.tagName === 'I'
        return isItalicTag || fontStyle === 'italic'
      }
      
      // Helper function to detect heading level from text or element
      const detectHeading = (text: string, el: Element): number | null => {
        // Check if it's an actual heading tag
        const tagMatch = el.tagName.match(/^H([1-6])$/)
        if (tagMatch) return parseInt(tagMatch[1])
        
        // Check for numbered headings like "2.2)", "1.1.1)", etc.
        const numberedMatch = text.match(/^(\d+(?:\.\d+)*)\)\s+/)
        if (numberedMatch) {
          const depth = numberedMatch[1].split('.').length
          return Math.min(depth + 1, 6) // Convert to heading level (2.2) -> H3
        }
        
        // Check for common heading patterns
        if (/^(Old Model|New Model|Why|How|What|When|Where|Conclusion|Summary|Introduction|Overview)/i.test(text.trim())) {
          return 2
        }
        
        // Check font size or class for heading detection
        const style = window.getComputedStyle(el)
        const fontSize = parseFloat(style.fontSize)
        if (fontSize >= 24) return 1
        if (fontSize >= 20) return 2
        if (fontSize >= 18) return 3
        
        return null
      }
      
      // Process images first
      tempDiv.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || ''
        const alt = img.getAttribute('alt') || ''
        img.replaceWith(document.createTextNode(`![${alt}](${src})\n\n`))
      })
      
      // Convert headings - check all potential heading elements
      const allElements = Array.from(tempDiv.querySelectorAll('*'))
      allElements.forEach(el => {
        const text = el.textContent?.trim() || ''
        if (!text) return
        
        const headingLevel = detectHeading(text, el)
        if (headingLevel) {
          // Remove any nested formatting before converting
          const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').trim()
          el.replaceWith(document.createTextNode(`${'#'.repeat(headingLevel)} ${cleanText}\n\n`))
        }
      })
      
      // Process actual heading tags
      for (let level = 6; level >= 1; level--) {
        tempDiv.querySelectorAll(`h${level}`).forEach(el => {
          const text = el.textContent?.trim() || ''
          if (text) {
            const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').trim()
            el.replaceWith(document.createTextNode(`${'#'.repeat(level)} ${cleanText}\n\n`))
          }
        })
      }
      
      // Convert links before other formatting
      tempDiv.querySelectorAll('a').forEach(el => {
        const href = el.getAttribute('href') || ''
        const text = el.textContent?.trim() || ''
        if (text && href) {
          el.replaceWith(document.createTextNode(`[${text}](${href})`))
        } else if (text) {
          el.replaceWith(document.createTextNode(text))
        }
      })
      
      // Convert bold text (handle nested cases)
      const processBold = (container: Element) => {
        const boldElements = Array.from(container.querySelectorAll('*')).filter(isBold)
        boldElements.forEach(el => {
          if (el.closest('pre, code')) return // Skip code blocks
          const text = el.textContent?.trim() || ''
          if (text && !text.startsWith('**') && !text.endsWith('**')) {
            // Only wrap if not already wrapped and not inside another bold
            const parent = el.parentElement
            if (!parent || !isBold(parent)) {
              el.replaceWith(document.createTextNode(`**${text}**`))
            }
          }
        })
      }
      processBold(tempDiv)
      
      // Convert italic text
      tempDiv.querySelectorAll('em, i').forEach(el => {
        if (el.closest('pre, code, strong, b')) return
        const text = el.textContent?.trim() || ''
        if (text && !text.startsWith('*') && !text.endsWith('*')) {
          el.replaceWith(document.createTextNode(`*${text}*`))
        }
      })
      
      // Convert lists - handle nested lists
      const processList = (list: Element, isOrdered: boolean, indent: number = 0) => {
        const items: string[] = []
        const prefix = '  '.repeat(indent)
        list.querySelectorAll(':scope > li').forEach((li, i) => {
          let text = li.textContent?.trim() || ''
          // Clean up any remaining formatting artifacts
          text = text.replace(/\*\*\*/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim()
          
          // Check for nested lists
          const nestedUl = li.querySelector(':scope > ul')
          const nestedOl = li.querySelector(':scope > ol')
          if (nestedUl) {
            const nestedText = processList(nestedUl, false, indent + 1)
            text += '\n' + nestedText
          } else if (nestedOl) {
            const nestedText = processList(nestedOl, true, indent + 1)
            text += '\n' + nestedText
          }
          
          if (text) {
            const marker = isOrdered ? `${i + 1}.` : '-'
            items.push(`${prefix}${marker} ${text}`)
          }
        })
        return items.join('\n')
      }
      
      tempDiv.querySelectorAll('ul').forEach(ul => {
        const listMarkdown = processList(ul, false)
        if (listMarkdown) {
          ul.replaceWith(document.createTextNode(listMarkdown + '\n\n'))
        }
      })
      
      tempDiv.querySelectorAll('ol').forEach(ol => {
        const listMarkdown = processList(ol, true)
        if (listMarkdown) {
          ol.replaceWith(document.createTextNode(listMarkdown + '\n\n'))
        }
      })
      
      // Convert blockquotes
      tempDiv.querySelectorAll('blockquote').forEach(el => {
        const text = el.textContent?.trim() || ''
        if (text) {
          el.replaceWith(document.createTextNode(`> ${text}\n\n`))
        }
      })
      
      // Convert code blocks
      tempDiv.querySelectorAll('pre code').forEach(el => {
        const text = el.textContent || ''
        const lang = el.className.match(/language-(\w+)/)?.[1] || ''
        const pre = el.closest('pre')
        if (pre) {
          pre.replaceWith(document.createTextNode(`\`\`\`${lang}\n${text}\n\`\`\`\n\n`))
        }
      })
      
      tempDiv.querySelectorAll('code').forEach(el => {
        if (!el.closest('pre')) {
          const text = el.textContent?.trim() || ''
          if (text) {
            el.replaceWith(document.createTextNode(`\`${text}\``))
          }
        }
      })
      
      // Convert paragraphs to proper line breaks
      tempDiv.querySelectorAll('p, div').forEach(el => {
        if (el.closest('li, blockquote, pre')) return
        const text = el.textContent?.trim() || ''
        if (text && !el.querySelector('ul, ol, h1, h2, h3, h4, h5, h6')) {
          // Only convert if it doesn't contain block elements
          if (el.tagName === 'P' || (el.tagName === 'DIV' && !el.querySelector('*'))) {
            el.replaceWith(document.createTextNode(text + '\n\n'))
          }
        }
      })
      
      // Get the final markdown
      markdown = tempDiv.textContent || tempDiv.innerText || plain
      
      // Clean up formatting artifacts
      markdown = markdown
        .replace(/\*\*\*\*/g, '') // Remove quadruple asterisks
        .replace(/\*\*\*/g, '') // Remove triple asterisks
        .replace(/\*\*:\*\*/g, ':') // Fix **:** patterns
        .replace(/\*\*([^*]+)\*\*\*\*/g, '**$1**') // Fix **text****
        .replace(/\n{3,}/g, '\n\n') // Max 2 newlines
        .replace(/[ \t]+\n/g, '\n') // Remove trailing spaces
        .trim()
      
      // Fix common LinkedIn formatting issues
      markdown = markdown
        .replace(/(\*\*[^*]+\*\*)\*\*/g, '$1') // Remove trailing ** after bold
        .replace(/\*\*(\*\*[^*]+\*\*)\*\*/g, '$1') // Fix nested bold
        .replace(/([^*])\*\*\*\*([^*])/g, '$1$2') // Remove **** in middle of text
    }
    
    const textarea = contentRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + markdown + content.substring(end)
    
    setContent(newContent)
    setTimeout(() => {
      textarea.focus()
      const newPos = start + markdown.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  const handleSave = async (isAutosave = false, shouldPublish = false) => {
    if (!title || (!content && !usePdf)) return

    setSaving(true)
    try {
      const postData = {
        title,
        content: usePdf ? '' : content,
        summary,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        coverImage,
        pdfFile: usePdf ? pdfFile : undefined,
        seoDescription,
        published: shouldPublish ? true : published,
        date: initialPost?.date || new Date().toISOString(),
      }

      const url = initialPost
        ? `/api/admin/posts/${initialPost.slug}`
        : '/api/admin/posts'

      const method = initialPost ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        if (!isAutosave) {
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
          if (shouldPublish) {
            setPublished(true)
            alert('Blog published successfully!')
          }
        }
        const data = await response.json()
        if (!initialPost && data.slug) {
          router.push(`/admin/posts/${data.slug}`)
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(errorData.error || 'Failed to save blog')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving blog. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    setContent(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const handleInsertImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setUploadingImage(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          insertMarkdown(`![Image](${data.url})`, '')
        } else {
          alert('Failed to upload image')
        }
      } catch (error) {
        console.error('Image upload error:', error)
        alert('Error uploading image')
      } finally {
        setUploadingImage(false)
      }
    }
    input.click()
  }

  const toolbarButtons = [
    { label: 'H1', action: () => insertMarkdown('# ', '') },
    { label: 'H2', action: () => insertMarkdown('## ', '') },
    { label: 'H3', action: () => insertMarkdown('### ', '') },
    { label: 'Bold', action: () => insertMarkdown('**', '**') },
    { label: 'Italic', action: () => insertMarkdown('*', '*') },
    { label: 'List', action: () => insertMarkdown('- ', '') },
    { label: 'Quote', action: () => insertMarkdown('> ', '') },
    { label: 'Code', action: () => insertMarkdown('`', '`') },
    { label: 'Code Block', action: () => insertMarkdown('```\n', '\n```') },
    { label: 'Image', action: handleInsertImage },
    { label: 'LaTeX', action: () => insertMarkdown('$', '$') },
    { label: 'LaTeX Block', action: () => insertMarkdown('$$\n', '\n$$') },
  ]

  return (
    <div className="bg-white rounded-lg border border-navy/10 overflow-hidden">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-navy/10 bg-offwhite flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-2 flex-wrap">
          {toolbarButtons.map((button) => (
            <button
              key={button.label}
              onClick={button.action}
              className="px-3 py-1.5 text-sm font-medium text-navy/70 hover:text-navy hover:bg-white rounded transition-colors"
            >
              {button.label}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 text-sm font-medium text-navy/70 hover:text-navy border border-navy/20 rounded transition-colors"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-navy/10 text-navy rounded hover:bg-navy/20 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
          <button
            onClick={() => handleSave(false, true)}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-violet text-white rounded hover:bg-violet/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Save & Publish'}
          </button>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-navy/70">Published</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Main Editor */}
        <div className="lg:col-span-2">
          {preview ? (
            <div className="prose prose-lg max-w-none serif prose-headings:font-semibold prose-headings:text-navy prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-navy/80 prose-p:leading-relaxed prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:text-navy/80 prose-li:my-2 prose-strong:text-navy prose-strong:font-semibold">
              <h1 className="text-4xl font-semibold text-navy mb-6">{title}</h1>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                  // @ts-ignore
                  h1({ children }: any) {
                    return <h1 className="text-3xl font-semibold text-navy mt-8 mb-4">{children}</h1>
                  },
                  // @ts-ignore
                  h2({ children }: any) {
                    return <h2 className="text-2xl font-semibold text-navy mt-8 mb-4">{children}</h2>
                  },
                  // @ts-ignore
                  h3({ children }: any) {
                    return <h3 className="text-xl font-semibold text-navy mt-6 mb-3">{children}</h3>
                  },
                  // @ts-ignore
                  p({ children }: any) {
                    return <p className="text-navy/80 leading-relaxed mb-4">{children}</p>
                  },
                  // @ts-ignore
                  ul({ children }: any) {
                    return <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>
                  },
                  // @ts-ignore
                  ol({ children }: any) {
                    return <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
                  },
                  // @ts-ignore
                  li({ children }: any) {
                    return <li className="text-navy/80">{children}</li>
                  },
                  // @ts-ignore
                  strong({ children }: any) {
                    return <strong className="font-semibold text-navy">{children}</strong>
                  },
                  // @ts-ignore
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-6"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`mono bg-navy/5 px-1.5 py-0.5 rounded ${className}`} {...props}>
                        {children}
                      </code>
                    )
                  },
                  // @ts-ignore
                  blockquote({ children }: any) {
                    return (
                      <blockquote className="border-l-4 border-violet/30 pl-6 py-2 my-6 italic text-navy/70">
                        {children}
                      </blockquote>
                    )
                  },
                  // @ts-ignore
                  img({ src, alt }: any) {
                    return (
                      <figure className="my-8">
                        <img src={src} alt={alt} className="w-full rounded-lg" />
                        {alt && <figcaption className="text-center text-sm text-navy/60 mt-2">{alt}</figcaption>}
                      </figure>
                    )
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePdf}
                    onChange={(e) => {
                      setUsePdf(e.target.checked)
                      if (!e.target.checked) {
                        setPdfFile('')
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-navy/70">Use PDF instead of text content</span>
                </label>
              </div>
              {usePdf ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">PDF File</label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      disabled={uploadingPdf}
                      className="w-full px-4 py-2 border border-navy/20 rounded-lg text-sm"
                    />
                    {uploadingPdf && <p className="mt-2 text-sm text-navy/60">Uploading...</p>}
                    {pdfFile && (
                      <div className="mt-4">
                        <p className="text-sm text-navy/70 mb-2">Current PDF: {pdfFile}</p>
                        <a
                          href={pdfFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet hover:text-violet/80 text-sm"
                        >
                          View PDF →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Start writing... (paste with formatting preserved)"
                  className="w-full h-96 px-4 py-3 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent font-mono text-sm resize-none"
                />
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">Cover Image</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full px-4 py-2 border border-navy/20 rounded-lg text-sm disabled:opacity-50"
              />
              {uploadingImage && <p className="text-sm text-navy/60">Uploading...</p>}
              <div className="text-sm text-navy/60">Or enter URL:</div>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent"
              />
            </div>
            {coverImage && (
              <div className="mt-3">
                <img src={coverImage} alt="Cover" className="w-full rounded-lg border border-navy/10" />
                <button
                  onClick={() => setCoverImage('')}
                  className="mt-2 text-sm text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-2">SEO Description</label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

