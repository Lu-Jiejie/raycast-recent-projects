import type { ComponentType } from 'react'
import { Action, ActionPanel, getPreferenceValues, List } from '@raycast/api'
import { useEffect, useState } from 'react'
import ChromeCommand from './chrome'
import CursorCommand from './cursor'
import EdgeCommand from './edge'
import { resolveAppExePath } from './logic/resolveAppExePath'
import VscodeCommand from './vscode'

// Define an interface for the preferences to get type safety
interface Preferences {
  vscodeStoragePath?: string
  cursorStoragePath?: string
  chromeBookmarkPath?: string
  edgeBookmarkPath?: string
}

// Define the base structure for each application we support
interface AppDefinition {
  name: string // The display name, also used by resolveAppExePath
  subtitle: string
  preferenceKey: keyof Preferences
  target: ComponentType
}

// Define the structure for an app that has been configured and resolved
interface ConfiguredApp extends AppDefinition {
  exePath: string
}

// An array of all possible applications
const APPS: AppDefinition[] = [
  {
    name: 'Visual Studio Code',
    subtitle: 'Recent Projects',
    preferenceKey: 'vscodeStoragePath',
    target: VscodeCommand,
  },
  {
    name: 'Cursor',
    subtitle: 'Recent Projects',
    preferenceKey: 'cursorStoragePath',
    target: CursorCommand,
  },
  {
    name: 'Google Chrome',
    subtitle: 'Bookmarks',
    preferenceKey: 'chromeBookmarkPath',
    target: ChromeCommand,
  },
  {
    name: 'Microsoft Edge',
    subtitle: 'Bookmarks',
    preferenceKey: 'edgeBookmarkPath',
    target: EdgeCommand,
  },
]

export default function Command() {
  const [configuredApps, setConfiguredApps] = useState<ConfiguredApp[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchConfiguredApps() {
      const preferences = getPreferenceValues<Preferences>()
      const appsWithStoragePath = APPS.filter((app) => {
        const path = preferences[app.preferenceKey]
        return path && path.trim() !== ''
      })

      const resolvedApps = await Promise.all(
        appsWithStoragePath.map(async (app) => {
          const exePath = await resolveAppExePath(app.name)
          if (exePath) {
            return { ...app, exePath }
          }
          return null
        }),
      )
      setConfiguredApps(resolvedApps.filter((app): app is ConfiguredApp => app !== null))
      setIsLoading(false)
    }

    fetchConfiguredApps()
  }, [])

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Select an application...">
      {configuredApps.length > 0
        ? (
            configuredApps.map(app => (
              <List.Item
                key={app.name}
                title={app.name}
                subtitle={app.subtitle}
                icon={{ fileIcon: app.exePath }}
                actions={(
                  <ActionPanel>
                    <Action.Push title={`Show ${app.subtitle}`} target={<app.target />} />
                  </ActionPanel>
                )}
              />
            ))
          )
        : (
            <List.EmptyView
              title="No Applications Configured"
              description="Please configure the paths for your applications in the extension settings."
            />
          )}
    </List>
  )
}
