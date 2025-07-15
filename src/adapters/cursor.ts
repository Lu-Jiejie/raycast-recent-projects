import { createVSCodeLikeAdapter } from './vscode'

export const cursorAdapter = createVSCodeLikeAdapter({
  appName: 'Cursor',
  icon: 'icons/cursor.png',
  storagePathKey: 'cursorStoragePath',
  exePathKey: 'cursorExePath',
})
