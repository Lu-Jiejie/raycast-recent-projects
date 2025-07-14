export interface Project {
  name: string
  path: string
  icon?: string
  isFavorite?: boolean
}

export interface Adapter {
  getRecentProjects: () => Project[]
  openProject: (path: string) => void
}
