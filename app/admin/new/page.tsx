import AdminEditor from '@/components/admin/AdminEditor'

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-navy mb-2">Create New Post</h1>
        <p className="text-navy/70">Write and publish a new blog post</p>
      </div>
      <AdminEditor />
    </div>
  )
}


