import type { Project } from '../types'
import { cursorAdapter } from './cursor'
import { vscodeAdapter } from './vscode'

export interface Adapter {
  appName: string
  getRecentProjects: () => Project[]
  openProject: (path: string) => void
}

export interface AppConfig {
  adapter: Adapter
  searchBarPlaceholder: string
  openTitle: string
  openIcon: string
}

export const appsConfig: Record<string, AppConfig> = {
  vscode: {
    adapter: vscodeAdapter,
    searchBarPlaceholder: 'Search recent projects for Visual Studio Code...',
    openTitle: 'Open in Visual Studio Code',
    openIcon: 'icons/vscode.png',
  },
  cursor: {
    adapter: cursorAdapter,
    searchBarPlaceholder: 'Search recent projects for Cursor...',
    openTitle: 'Open in Cursor',
    openIcon: 'icons/cursor.png',
  },
}
