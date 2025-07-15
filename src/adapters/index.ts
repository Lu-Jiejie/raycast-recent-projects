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
  searchBarPlaceholder?: string
  openTitle?: string
  icon: string
}

export const appsConfig: Record<string, AppConfig> = {
  vscode: {
    adapter: vscodeAdapter,
    icon: 'icons/vscode.png',
  },
  cursor: {
    adapter: cursorAdapter,
    icon: 'icons/cursor.png',
  },
}
