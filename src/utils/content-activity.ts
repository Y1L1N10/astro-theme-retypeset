import type { ActivityItem } from './github-activity'

export function getPostActivities(posts: any[]): ActivityItem[] {
  return posts.map(post => ({
    id: post.slug,
    type: 'BlogPost', // This will be used for filtering and icon selection
    repo: {
      name: post.data.title,
      url: `/posts/${post.slug}/`,
    },
    payload: {
      description: post.data.description,
      tags: post.data.tags,
    },
    created_at: post.data.published ? new Date(post.data.published).toISOString() : new Date().toISOString(),
  }))
}
