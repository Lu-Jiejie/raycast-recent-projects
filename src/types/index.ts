export interface Project {
  name: string
  path: string
  icon?: string
}

export interface Adapter {
  getRecentProjects: () => Project[]
  openProject: (path: string) => void
}
