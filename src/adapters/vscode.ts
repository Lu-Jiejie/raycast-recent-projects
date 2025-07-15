import type { Adapter } from '.'
import type { Project } from '../types'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import { getPreferenceValues } from '@raycast/api'

interface VSCodeLikeAdapterConfig {
  appName: string
  icon: string
  storagePathKey: string
  exePathKey: string
}

export function createVSCodeLikeAdapter(config: VSCodeLikeAdapterConfig): Adapter {
  return {
    icon: config.icon,
    appName: config.appName,
    getRecentProjects() {
      const preferences = getPreferenceValues<Record<string, string>>()
      const storagePath = preferences[config.storagePathKey]

      try {
        const storageContent = fs.readFileSync(storagePath, 'utf-8')
        const storageJson = JSON.parse(storageContent)
        // VSCode 最近项目存储在 profileAssociations.workspaces 中
        const workspaceMap = storageJson?.profileAssociations?.workspaces || {}
        const workspaceKeys = Object.keys(workspaceMap)
        const recentProjects: Project[] = []

        for (const workspaceKey of workspaceKeys.reverse()) {
          if (workspaceKey.startsWith('file:///')) {
            let projectPath = workspaceKey.replace('file:///', '')
            // URL 解码和路径格式转换
            projectPath = decodeURIComponent(projectPath)
            projectPath = projectPath.charAt(0).toUpperCase() + projectPath.slice(1)

            recentProjects.push({
              appName: config.appName,
              name: projectPath.split('/').pop() || projectPath,
              path: projectPath,
              icon: config.icon,
            })
          }
        }
        return recentProjects
      }
      catch (e) {
        throw new Error(`Failed to read ${config.appName} recent projects: ${String(e)}`)
      }
    },

    openProject(projectPath: string) {
      const preferences = getPreferenceValues<Record<string, string>>()
      const exePath = preferences[config.exePathKey]

      exec(`"${exePath}" "${projectPath}"`, (err) => {
        if (err) {
          throw new Error(`Failed to open project in ${config.appName}: ${String(err)}`)
        }
      })
    },
  }
}

// VSCode 的默认实现
export const vscodeAdapter = createVSCodeLikeAdapter({
  appName: 'Visual Studio Code',
  icon: 'icons/vscode.png',
  storagePathKey: 'vscodeStoragePath',
  exePathKey: 'vscodeExePath',
})
