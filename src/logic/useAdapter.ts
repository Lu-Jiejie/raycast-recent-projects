import type { Adapter, AppConfig } from '../types'
import { getPreferenceValues } from '@raycast/api'
import { fetcherMap } from '../registry/fetcher'
// import { resolveAppExePath } from './resolveAppExePath'

export function useAdapter(app: AppConfig): Adapter {
  const preferences = getPreferenceValues()

  const storagePathKey = `${app.id}StoragePath`
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

      const exePath = userDefinedExePath
      // || await resolveAppExePath(app.name)

      return fetcherFn({
        appName: app.name,
        appIcon: app.icon,
        appStoragePath: storagePath,
        appExePath: exePath || '',
        hideNotExistItems,
      })
    },
  }

  return adapter
}
