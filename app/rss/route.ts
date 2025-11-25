import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = await getAllPosts()

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nayan Kanaparthi</title>
    <description>Building at the intersection of strategy, AI, and quantitative thinking</description>
    <link>https://nayankanaparthi.com</link>
    <atom:link href="https://nayankanaparthi.com/rss" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts
      .map(
        (post) => `    <item>
      <title>${post.title}</title>
      <description>${post.summary || post.excerpt}</description>
      <link>https://nayankanaparthi.com/blogs/${post.slug}</link>
      <guid>https://nayankanaparthi.com/blogs/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}


