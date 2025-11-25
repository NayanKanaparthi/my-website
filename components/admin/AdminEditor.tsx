'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/posts'

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

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const html = e.clipboardData.getData('text/html')
    const plain = e.clipboardData.getData('text/plain')
    
    let markdown = plain
    
    if (html) {
      // Convert HTML to markdown
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      
      // Convert headings
      tempDiv.querySelectorAll('h1').forEach(el => {
        el.outerHTML = `# ${el.textContent}\n\n`
      })
      tempDiv.querySelectorAll('h2').forEach(el => {
        el.outerHTML = `## ${el.textContent}\n\n`
      })
      tempDiv.querySelectorAll('h3').forEach(el => {
        el.outerHTML = `### ${el.textContent}\n\n`
      })
      
      // Convert bold
      tempDiv.querySelectorAll('strong, b').forEach(el => {
        el.outerHTML = `**${el.textContent}**`
      })
      
      // Convert italic
      tempDiv.querySelectorAll('em, i').forEach(el => {
        el.outerHTML = `*${el.textContent}*`
      })
      
      // Convert lists
      tempDiv.querySelectorAll('ul li').forEach(el => {
        el.outerHTML = `- ${el.textContent}\n`
      })
      tempDiv.querySelectorAll('ol li').forEach((el, i) => {
        el.outerHTML = `${i + 1}. ${el.textContent}\n`
      })
      
      // Convert blockquotes
      tempDiv.querySelectorAll('blockquote').forEach(el => {
        el.outerHTML = `> ${el.textContent}\n\n`
      })
      
      // Convert links
      tempDiv.querySelectorAll('a').forEach(el => {
        const href = el.getAttribute('href') || ''
        el.outerHTML = `[${el.textContent}](${href})`
      })
      
      markdown = tempDiv.textContent || tempDiv.innerText || plain
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

  const handleSave = async (isAutosave = false) => {
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
        published,
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
        }
        const data = await response.json()
        if (!initialPost && data.slug) {
          router.push(`/admin/posts/${data.slug}`)
        }
      }
    } catch (error) {
      console.error('Save error:', error)
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
            className="px-4 py-2 text-sm font-medium bg-violet text-white rounded hover:bg-violet/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </button>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-navy/70">Publish</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Main Editor */}
        <div className="lg:col-span-2">
          {preview ? (
            <div className="prose max-w-none">
              <h1 className="text-4xl font-semibold text-navy mb-6">{title}</h1>
              <div className="text-navy/70 leading-relaxed whitespace-pre-wrap">{content}</div>
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

