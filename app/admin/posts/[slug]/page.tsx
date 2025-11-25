import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import AdminEditor from '@/components/admin/AdminEditor'

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-navy mb-2">Edit Post</h1>
        <p className="text-navy/70">Edit and update your blog post</p>
      </div>
      <AdminEditor initialPost={post} />
    </div>
  )
}


