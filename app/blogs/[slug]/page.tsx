import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ProgressBar from '@/components/ProgressBar'
import 'katex/dist/katex.min.css'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const allPosts = await getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug)
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  // For PDF posts, use full-page layout
  if (post.pdfFile) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header Bar - Fixed at top */}
        <div className="sticky top-0 z-50 bg-white border-b border-navy/10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/blogs" className="text-navy/70 hover:text-navy transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div>
                  <h1 className="text-lg font-semibold text-navy">{post.title}</h1>
                  <div className="flex items-center gap-2 text-xs text-navy/60 mt-1">
                    <span>{formatDate(post.date)}</span>
                    <span>•</span>
                    <span className="text-violet font-medium">PDF Document</span>
                  </div>
                </div>
              </div>
              <a
                href={post.pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-violet hover:text-violet/80 font-medium"
              >
                Open in new tab
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Full-page PDF Viewer */}
        <div className="flex-1 w-full">
          <iframe
            src={`${post.pdfFile}#toolbar=1`}
            className="w-full h-full"
            style={{ height: 'calc(100vh - 80px)' }}
            title={post.title}
          />
        </div>
      </div>
    )
  }

  // Regular blog post layout
  return (
    <article className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-navy/5 z-50">
        <div
          id="progress-bar"
          className="h-full bg-violet transition-all duration-150"
          style={{ width: '0%' }}
        />
      </div>
      <ProgressBar />

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-semibold text-navy mb-6 text-balance serif">
          {post.title}
        </h1>
        <div className="flex items-center justify-between text-sm text-navy/60 mb-6">
          <div className="flex items-center space-x-4">
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{post.readingTime} min read</span>
          </div>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-violet bg-violet/10 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-12">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none serif prose-headings:font-semibold prose-headings:text-navy prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-navy/80 prose-p:leading-relaxed prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-li:text-navy/80 prose-li:my-2 prose-strong:text-navy prose-strong:font-semibold">
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
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Navigation */}
      <nav className="mt-16 pt-8 border-t border-navy/10">
        <div className="flex items-center justify-between">
          {prevPost ? (
            <Link
              href={`/blogs/${prevPost.slug}`}
              className="group flex items-center space-x-2 text-navy/70 hover:text-navy transition-colors"
            >
              <span>←</span>
              <div>
                <div className="text-xs text-navy/50">Previous</div>
                <div className="font-medium">{prevPost.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost && (
            <Link
              href={`/blogs/${nextPost.slug}`}
              className="group flex items-center space-x-2 text-navy/70 hover:text-navy transition-colors text-right"
            >
              <div>
                <div className="text-xs text-navy/50">Next</div>
                <div className="font-medium">{nextPost.title}</div>
              </div>
              <span>→</span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  )
}

