import type { Project } from '../../types'
import { readFile } from 'node:fs/promises'
import { getPreferenceValues } from '@raycast/api'

type ChromeBookmarkItem = {
  children?: ChromeBookmarkItem[]
  date_added: string
  date_last_used: string
  name: string
  id: string
} & (
  { type: 'url', url: string }
  | { type: 'folder' }
)

export async function getRecentProjects() {
  const preferences = getPreferenceValues<Preferences.Chrome>()
  const bookmarkPath = preferences.chromeBookmarkPath
  const content = JSON.parse(await readFile(bookmarkPath, 'utf-8'))
  const bookmark: ChromeBookmarkItem[] = [
    ...content.roots.bookmark_bar.children || [],
    ...content.roots.other.children || [],
    ...content.roots.synced.children || [],
  ]

  const result: Project[] = []
  const runThrough = (children: ChromeBookmarkItem[], tags: string[]) => {
    for (const child of children) {
      if (child.type === 'url') {
        result.push({
          appName: 'Google Chrome',
          appIcon: 'icons/chrome.png',
          appExePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          type: 'bookmark',
          id: child.id,
          name: child.name,
          path: child.url,
          tags,
        })
      }
      else if (child.type === 'folder' && child.children) {
        runThrough(child.children, [...tags, child.name])
      }
    }
  }
  runThrough(bookmark, [])
}
