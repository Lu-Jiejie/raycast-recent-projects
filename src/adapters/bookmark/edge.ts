import type { Adapter } from '..'
import { getPreferenceValues } from '@raycast/api'
import { getChromeLikeBookmarks } from './chrome'

const preferences = getPreferenceValues<Preferences>()
export const edgeBookmarkAdapter: Adapter = {
  appName: 'Microsoft Edge',
  appIcon: 'edge.png',
  appStoragePath: preferences.edgeBookmarkPath,
  getRecentProjects: async () => {
    return getChromeLikeBookmarks({
      appName: 'Microsoft Edge',
      appBookmarkPath: preferences.edgeBookmarkPath,
      appExePath: preferences.edgeExePath,
    })
  },
}
