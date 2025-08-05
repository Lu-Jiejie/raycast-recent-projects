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
  isFavorite?: boolean
}

export type FavoriteItem = Omit<Project, 'isFavorite'>
