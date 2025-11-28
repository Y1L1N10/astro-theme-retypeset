import type { ActivityItem } from './github-activity'
import { defaultLocale } from '@/config'
import { getPostPath } from '@/i18n/path'

export function getPostActivities(posts: any[], lang: string = defaultLocale): ActivityItem[] {
  return posts.map((post) => {
    const slug = post.data.abbrlink || post.id
    return {
      id: slug,
      type: 'BlogPost', // This will be used for filtering and icon selection
      repo: {
        name: post.data.title,
        url: getPostPath(slug, lang),
      },
      payload: {
        description: post.data.description,
        tags: post.data.tags,
      },
      created_at: post.data.published ? new Date(post.data.published).toISOString() : new Date().toISOString(),
    }
  })
}
