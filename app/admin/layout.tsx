import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verify authentication (runs in Node.js runtime, so JWT works)
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        {children}
      </div>
    </div>
  )
}
