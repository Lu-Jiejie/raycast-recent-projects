import type { Adapter } from '..'
import { getPreferenceValues } from '@raycast/api'
import { resolveAppExePath } from '../../logic/resolveAppExePath'
import { getVSCodeLikeRecentProjects } from './vscode'

const preferences = getPreferenceValues<Preferences>()
export const cursorAdapter: Adapter = {
  appName: 'Cursor',
  appIcon: 'icons/cursor.png',
  appStoragePath: preferences.cursorStoragePath,
  getRecentProjects: async () => getVSCodeLikeRecentProjects({
    appName: 'Cursor',
    appIcon: 'icons/cursor.png',
    appExePath: preferences.cursorExePath || await resolveAppExePath('Cursor'),
    appStoragePath: preferences.cursorStoragePath,
    hideNotExistItems: preferences.hideNotExistItems,
  }),
}
