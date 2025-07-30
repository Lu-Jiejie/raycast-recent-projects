import type { Project } from '../types'
import { cursorAdapter } from './editor/cursor'
import { vscodeAdapter } from './editor/vscode'

export interface Adapter {
  appName: string
  appIcon: string
  appExePath: string
  getRecentProjects: () => Project[]
}

export interface AppConfig {
  adapter: Adapter
  searchBarPlaceholder?: string
  openTitle?: string
}

export const appsConfig: Record<string, AppConfig> = {
  vscode: {
    adapter: vscodeAdapter,
  },
  cursor: {
    adapter: cursorAdapter,
  },
}
