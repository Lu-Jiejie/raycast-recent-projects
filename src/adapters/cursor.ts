import { createVSCodeLikeAdapter } from './vscode'

export const cursorAdapter = createVSCodeLikeAdapter({
  appName: 'Cursor',
  iconPath: 'icons/cursor.png',
  storagePathKey: 'cursorStoragePath',
  exePathKey: 'cursorExePath',
})
