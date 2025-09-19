import type { AppConfig } from './appsConfig'
import { Action, ActionPanel, getPreferenceValues, List } from '@raycast/api'
import { useEffect, useState } from 'react'
import { APPS_CONFIG } from './appsConfig'
import { AppView } from './components/AppView' // Import the new generic view
import { resolveAppExePath } from './logic/resolveAppExePath'

interface Preferences {
  [key: string]: string | boolean | undefined
}

interface ConfiguredApp extends AppConfig {
  exePath: string
}

export default function Command() {
  const [configuredApps, setConfiguredApps] = useState<ConfiguredApp[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchConfiguredApps() {
      const preferences = getPreferenceValues<Preferences>()
      const appsWithStoragePath = APPS_CONFIG.filter((app) => {
        const storagePathKey = `${app.id}StoragePath`
        const path = preferences[storagePathKey] as string | undefined
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
      {configuredApps.map(app => (
        <List.Item
          key={app.id}
          title={app.name}
          subtitle={app.type === 'workspace' ? 'Recent Projects' : 'Bookmarks'}
          icon={{ fileIcon: app.exePath }}
          actions={(
            <ActionPanel>
              {/* Push the generic AppView with the specific app config */}
              <Action.Push title={`Show ${app.name}`} target={<AppView app={app} />} />
            </ActionPanel>
          )}
        />
      ))}
    </List>
  )
}
