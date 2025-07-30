export interface Project {
  name: string
  path: string
  id: string
  appName: string
  appExePath: string
  appIcon: string
  isFavorite?: boolean
}

export interface BrowserBookmark {
  name: string
  url: string
  id: string
  browserName: string
  browserExePath: string
  browserIcon: string
  isFavorite?: boolean
}

export interface FavoriteItem {
  appName: string
  name: string
  path: string
  icon: string
}
