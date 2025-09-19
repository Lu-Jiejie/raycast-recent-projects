import type { Project } from '../types'
import { fetchChromiumBookmarks } from './bookmark/chrome'
import { fetchVscodeLikeProjects } from './editor/vscode'

// --- INTERFACE ---
export interface Adapter {
  appName: string
  appIcon: string
  appStoragePath?: string
  getRecentProjects: () => Promise<Project[]>
  searchBarPlaceholder?: string
  openTitle?: string
}

// --- MAP ---
// This map links an app ID to its specific data-fetching function.
export const fetcherMap = {
  vscode: fetchVscodeLikeProjects,
  cursor: fetchVscodeLikeProjects,
  chrome: fetchChromiumBookmarks,
  edge: fetchChromiumBookmarks,
}
