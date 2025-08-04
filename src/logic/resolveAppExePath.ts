import type { Application } from '@raycast/api'
import { getApplications } from '@raycast/api'

let applicationsCache: Application[] | null = null
const cache: Record<string, string> = {}

// Auto resolve application executable path based on app name and preferences
// If preferencesAppExePath isn't provided, get exePath from getApplications
export async function resolveAppExePath(
  appName: string,
): Promise<string> {
  if (cache[appName]) {
    return cache[appName]
  }

  // get app exe path from getApplications
  if (!applicationsCache) {
    const applications = await getApplications()
    applicationsCache = applications
  }

  const appExePath = applicationsCache.find((app) => {
    return app.name === appName
  })?.path
  cache[appName] = appExePath || ''

  return cache[appName]
}
