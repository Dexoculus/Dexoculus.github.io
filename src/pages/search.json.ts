import { posts } from "@/lib/content";

export function GET() {
  return new Response(
    JSON.stringify(
      posts.map((post) => ({
        title: post.title,
        tags: post.tags,
        description: post.description,
        url: post.externalUrl || `/note/${post.slug}/`
      }))
    ),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
