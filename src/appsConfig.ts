export interface AppConfig {
  id: string // e.g., 'vscode'
  name: string // e.g., 'Visual Studio Code'
  type: 'workspace' | 'bookmark'
  icon: string
  storagePathDesc: string
  exePathDesc: string
}

export const APPS_CONFIG: AppConfig[] = [
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
]
