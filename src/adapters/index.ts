import type { Project } from '../types'
import { cursorAdapter } from './cursor'
import { vscodeAdapter } from './vscode'

export interface Adapter {
  appName: string
  icon: string
  getRecentProjects: () => Project[]
  openProject: (path: string) => Promise<void>
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
