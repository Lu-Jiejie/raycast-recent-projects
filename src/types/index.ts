export interface Project {
  type: 'workspace' | 'bookmark'
  name: string
  path: string
  id: string
  appName: string
  appExePath: string
  appIcon: string
  isFavorite?: boolean
}

export type FavoriteItem = Omit<Project, 'isFavorite'>
