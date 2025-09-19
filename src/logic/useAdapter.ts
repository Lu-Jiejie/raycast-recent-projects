import type { Adapter } from '../adapters'
import type { AppConfig } from '../appsConfig'
import { getPreferenceValues } from '@raycast/api'
import { fetcherMap } from '../adapters'
import { resolveAppExePath } from './resolveAppExePath'

interface Preferences {
  [key: string]: any
}

export function useAdapter(app: AppConfig): Adapter {
  const preferences = getPreferenceValues<Preferences>()

  const storagePathKey = app.type === 'workspace' ? `${app.id}StoragePath` : `${app.id}BookmarkPath`
  const storagePath = preferences[storagePathKey] as string | undefined
  const userDefinedExePath = preferences[`${app.id}ExePath`] as string | undefined
  const hideNotExistItems = preferences.hideNotExistItems as boolean

  const fetcherFn = fetcherMap[app.id as keyof typeof fetcherMap]

  const adapter: Adapter = {
    appName: app.name,
    appIcon: app.icon,
    appStoragePath: storagePath,
    getRecentProjects: async () => {
      if (!storagePath) {
        return []
      }

      const exePath = userDefinedExePath || await resolveAppExePath(app.name)

      return fetcherFn({
        appName: app.name,
        appIcon: app.icon,
        appStoragePath: storagePath,
        appExePath: exePath,
        hideNotExistItems,
      })
    },
  }

  return adapter
}
