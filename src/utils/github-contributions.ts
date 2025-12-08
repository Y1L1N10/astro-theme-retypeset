import { memoize } from '@/utils/cache'

export interface GitHubContribution {
  date: string
  count: number
  level: number
}

export interface GitHubData {
  total: Record<string, number>
  contributions: GitHubContribution[]
}

async function _getGitHubContributions(username: string): Promise<Map<string, number>> {
  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
    if (!response.ok) {
      console.error(`Failed to fetch GitHub contributions for ${username}: ${response.statusText}`)
      return new Map()
    }

    const data: GitHubData = await response.json()
    const contributionMap = new Map<string, number>()

    data.contributions.forEach((item) => {
      if (item.count > 0) {
        contributionMap.set(item.date, item.count)
      }
    })

    return contributionMap
  }
  catch (error) {
    console.error(`Error fetching GitHub contributions for ${username}:`, error)
    return new Map()
  }
}

export const getGitHubContributions = memoize(_getGitHubContributions)
