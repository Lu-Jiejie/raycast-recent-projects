import type { Adapter } from '..'
import { getPreferenceValues } from '@raycast/api'
import { getVSCodeLikeRecentProjects } from './vscode'

const preferences = getPreferenceValues<Preferences.Cursor>()
export const cursorAdapter: Adapter = {
  appName: 'Cursor',
  appExePath: preferences.cursorExePath,
  appIcon: 'icons/cursor.png',
  getRecentProjects: () => getVSCodeLikeRecentProjects({
    appName: 'Cursor',
    appIcon: 'icons/cursor.png',
    appExePath: preferences.cursorExePath,
    appStoragePath: preferences.cursorStoragePath,
  }),
}
