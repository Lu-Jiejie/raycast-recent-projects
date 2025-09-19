import type { AppConfig } from '../appsConfig'
import { useAdapter } from '../logic/useAdapter'
import { BookmarkList } from './bookmark/BookmarkList'
import { WorkspaceList } from './workspace/WorkspaceList'

interface AppViewProps {
  app: AppConfig
}

// This is the single, generic view component that can render any app's list.
export function AppView({ app }: AppViewProps) {
  // The hook now returns the adapter object that the list components expect.
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
