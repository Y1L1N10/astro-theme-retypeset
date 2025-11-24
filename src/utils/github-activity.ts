import { memoize } from '@/utils/cache'

export interface ActivityItem {
  id: string
  type: 'PushEvent' | 'WatchEvent' | 'PullRequestEvent' | 'CreateEvent' | 'ReleaseEvent'
  repo: { name: string; url: string }
  payload: any
  created_at: string
}

async function _getRecentActivity(username: string): Promise<ActivityItem[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events?per_page=30`)
    if (!response.ok) {
      console.error(`Failed to fetch GitHub activity for ${username}: ${response.statusText}`)
      return []
    }

    const data = await response.json()
    
    // Filter and format
    const interestingEvents = ['PushEvent', 'WatchEvent', 'PullRequestEvent', 'CreateEvent', 'ReleaseEvent']
    
    const activities = data
      .filter((event: any) => interestingEvents.includes(event.type))
      .map((event: any) => ({
        id: event.id,
        type: event.type as ActivityItem['type'],
        repo: {
          name: event.repo.name,
          url: `https://github.com/${event.repo.name}`
        },
        payload: event.payload,
        created_at: event.created_at
      }))
      // Limit to top 15 to avoid clutter
      .slice(0, 15)

    return activities
  } catch (error) {
    console.error(`Error fetching GitHub activity for ${username}:`, error)
    return []
  }
}

export const getRecentActivity = memoize(_getRecentActivity)
