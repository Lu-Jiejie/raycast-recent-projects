import type { Project } from '../../types'
import { readFile } from 'fs-extra'

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

export async function fetchChromiumBookmarks({
  appName,
  appStoragePath: appBookmarkPath,
  appExePath,
}: {
  appName: string
  appStoragePath: string
  appExePath: string
}) {
  const content = JSON.parse(await readFile(appBookmarkPath, 'utf-8'))

  const result: Project[] = []
  const runThrough = (children: ChromeBookmarkItem[], tags: string[]) => {
    for (const child of children) {
      if (child.type === 'url') {
        result.push({
          appName,
          icon: '',
          appExePath,
          type: 'bookmark',
          id: `${appName}-${child.id}`,
          name: child.name,
          path: child.url,
          tags,
          date: child.date_last_used === '0' ? child.date_last_used : child.date_added,
        })
      }
      else if (child.type === 'folder' && child.children) {
        runThrough(child.children, [child.name, ...tags])
      }
    }
  }

  for (const rootKey of Object.keys(content.roots)) {
    const rootItem = content.roots[rootKey]
    if (rootItem.children?.length) {
      runThrough(rootItem.children, [rootItem.name])
    }
  }

  return result
}
