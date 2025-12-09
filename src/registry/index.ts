import type { AppConfig } from '../types'

export const appsConfig: AppConfig[] = [
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    type: 'workspace',
    icon: 'icons/vscode.png',
    storagePathDesc: 'Path to "state.vscdb"',
    exePathDesc: 'Path to "code.exe"',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    type: 'workspace',
    icon: 'icons/cursor.png',
    storagePathDesc: 'Path to "state.vscdb"',
    exePathDesc: 'Path to "Cursor.exe"',
  },
  {
    id: 'chrome',
    name: 'Google Chrome',
    type: 'bookmark',
    icon: 'icons/chrome.png',
    storagePathDesc: 'Path to "Bookmarks"',
    exePathDesc: 'Path to "chrome.exe"',
  },
  {
    id: 'edge',
    name: 'Microsoft Edge',
    type: 'bookmark',
    icon: 'icons/edge.png',
    storagePathDesc: 'Path to "Bookmarks"',
    exePathDesc: 'Path to "msedge.exe"',
  },
  {
    id: 'typora',
    name: 'Typora',
    type: 'workspace',
    icon: 'icons/typora.png',
    storagePathDesc: 'Path to "history.data"',
    exePathDesc: 'Path to "Typora.exe"',
  },
]
