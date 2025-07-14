import type { Adapter, Project } from '../types'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import { getPreferenceValues } from '@raycast/api'

export const vscodeAdapter: Adapter = {
  getRecentProjects() {
    const { vscodeStoragePath } = getPreferenceValues<Preferences.Vscode>()
    try {
      const storageContent = fs.readFileSync(vscodeStoragePath, 'utf-8')
      const storageJson = JSON.parse(storageContent)
      const workspaceMap = storageJson?.profileAssociations?.workspaces || {}
      const workspaceKeys = Object.keys(workspaceMap)
      const recentProjects: Project[] = []
      for (const workspaceKey of workspaceKeys.reverse()) {
        if (workspaceKey.startsWith('file:///')) {
          let projectPath = workspaceKey.replace('file:///', '')
          // projectPath = projectPath.replace(/%3A/g, ':').replace(/\//g, '\\')
          projectPath = decodeURIComponent(projectPath)
          projectPath = projectPath.charAt(0).toUpperCase() + projectPath.slice(1)
          recentProjects.push({
            name: projectPath.split('/').pop() || projectPath,
            path: projectPath,
            icon: 'icons/vscode.png',
          })
        }
      }
      return recentProjects
    }
    catch (e) {
      throw new Error(`Failed to read VSCode recent projects: ${String(e)}`)
    }
  },
  openProject(projectPath: string) {
    const { vscodeExePath } = getPreferenceValues<Preferences.Vscode>()
    exec(`"${vscodeExePath}" "${projectPath}"`, (err) => {
      if (err) {
        throw new Error(`Failed to open project: ${String(err)}`)
      }
    })
  },
}
