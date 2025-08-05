import type { Project } from '../types'
import { chromeBookmarkAdapter } from './bookmark/chrome'
import { edgeBookmarkAdapter } from './bookmark/edge'
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

export const adapterMap: Record<
  'workspace' | 'bookmark',
  Record<string, Adapter>
> = {
  workspace: {
    vscode: vscodeAdapter,
    cursor: cursorAdapter,
  },
  bookmark: {
    chrome: chromeBookmarkAdapter,
    edge: edgeBookmarkAdapter,
  },
}
