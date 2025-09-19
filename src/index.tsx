import { Action, ActionPanel, getPreferenceValues, List, openExtensionPreferences } from '@raycast/api'
import { useMemo } from 'react'
import { APPS_CONFIG } from './appsConfig'
import { AppView } from './components/AppView'

interface Preferences {
  [key: string]: string | boolean | undefined
}

export default function Command() {
  const { workspaceApps, bookmarkApps, unconfiguredApps } = useMemo(() => {
    const preferences = getPreferenceValues<Preferences>()
    const configuredApps: typeof APPS_CONFIG = []
    const unconfiguredApps: typeof APPS_CONFIG = []

    APPS_CONFIG.forEach((app) => {
      const storagePathKey = `${app.id}StoragePath`
      const path = preferences[storagePathKey] as string | undefined
      if (path && path.trim() !== '') {
        configuredApps.push(app)
      }
      else {
        unconfiguredApps.push(app)
      }
    })

    const workspaceApps = configuredApps.filter(app => app.type === 'workspace')
    const bookmarkApps = configuredApps.filter(app => app.type === 'bookmark')

    return { workspaceApps, bookmarkApps, unconfiguredApps }
  }, [])

  return (
    <List searchBarPlaceholder="Select an application...">
      <List.Section title="Workspace">
        {workspaceApps.map(app => (
          <List.Item
            key={app.id}
            title={app.name}
            subtitle="Recent Projects"
            icon={app.icon}
            actions={(
              <ActionPanel>
                <Action.Push title={`Show ${app.name}`} target={<AppView app={app} />} />
                <Action title="Configure Extension" onAction={openExtensionPreferences} />
              </ActionPanel>
            )}
          />
        ))}
      </List.Section>
      <List.Section title="Bookmark">
        {bookmarkApps.map(app => (
          <List.Item
            key={app.id}
            title={app.name}
            subtitle="Bookmarks"
            icon={app.icon}
            actions={(
              <ActionPanel>
                <Action.Push title={`Show ${app.name}`} target={<AppView app={app} />} />
                <Action title="Configure Extension" onAction={openExtensionPreferences} />
              </ActionPanel>
            )}
          />
        ))}
      </List.Section>
      <List.Section title="Unconfigured">
        {unconfiguredApps.map(app => (
          <List.Item
            key={app.id}
            title={app.name}
            subtitle={app.type.charAt(0).toUpperCase() + app.type.slice(1)}
            icon={app.icon}
            actions={(
              <ActionPanel>
                <Action title="Configure Extension" onAction={openExtensionPreferences} />
              </ActionPanel>
            )}
          />
        ))}
      </List.Section>
    </List>
  )
}
