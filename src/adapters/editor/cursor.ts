import type { Adapter } from '..'
import { getPreferenceValues } from '@raycast/api'
import { getVSCodeLikeRecentProjects } from './vscode'

const preferences = getPreferenceValues<Preferences>()
export const cursorAdapter: Adapter = {
  appName: 'Cursor',
  appIcon: 'icons/cursor.png',
  appStoragePath: preferences.cursorStoragePath,
  getRecentProjects: () => getVSCodeLikeRecentProjects({
    appName: 'Cursor',
    appIcon: 'icons/cursor.png',
    appExePath: preferences.cursorExePath,
    appStoragePath: preferences.cursorStoragePath,
    hideNotExistItems: preferences.hideNotExistItems,
  }),
}
