export interface Project {
  type: 'workspace' | 'bookmark'
  name: string
  path: string
  id: string
  appName: string
  appExePath: string
  icon: string
  /** only for bookmarks, maybe */
  tags?: string[]
  /** only for bookmarks, maybe */
  date?: string
  details?: string
  isFavorite?: boolean
}

export type FavoriteItem = Omit<Project, 'isFavorite'>

export interface Adapter {
  appName: string
  appIcon: string
  appStoragePath?: string
  getRecentProjects: () => Promise<Project[]>
  searchBarPlaceholder?: string
  openTitle?: string
}
