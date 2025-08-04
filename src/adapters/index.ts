import type { Project } from '../types'
import { cursorAdapter } from './editor/cursor'
import { vscodeAdapter } from './editor/vscode'

export interface Adapter {
  appName: string
  appIcon: string
  appStoragePath: string
  getRecentProjects: () => Promise<Project[]>
  searchBarPlaceholder?: string
  openTitle?: string
}

// export interface AppConfig {
//   adapter: Adapter
// }

export const adapterMap: Record<string, Adapter> = {
  vscode: vscodeAdapter,
  cursor: cursorAdapter,
}
