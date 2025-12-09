import type { AppConfig } from '../types'
import { useAdapter } from '../logic/useAdapter'
import { BookmarkList } from './bookmark/BookmarkList'
import { WorkspaceList } from './workspace/WorkspaceList'

export function AppView({ app }: { app: AppConfig }) {
  const adapter = useAdapter(app)

  if (app.type === 'workspace') {
    return (
      <WorkspaceList
        adapter={adapter}
      />
    )
  }

  if (app.type === 'bookmark') {
    return (
      <BookmarkList
        adapter={adapter}
      />
    )
  }

  return null
}
