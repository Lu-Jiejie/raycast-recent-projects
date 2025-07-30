import type { Adapter } from '..'
import type { Project } from '../../types'
import fs from 'node:fs'
import { getPreferenceValues } from '@raycast/api'

export function getVSCodeLikeRecentProjects({
  appName,
  appIcon,
  appExePath,
  appStoragePath,
}: {
  appName: string
  appIcon: string
  appExePath: string
  appStoragePath: string
}): Project[] {
  try {
    const storageContent = fs.readFileSync(appStoragePath, 'utf-8')
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
        // 换为windows的斜杠
        // projectPath = projectPath.replace(/\//g, '\\')
        recentProjects.push({
          appName,
          name: projectPath.split('/').pop() || projectPath,
          path: projectPath,
          appExePath,
          appIcon,
          id: projectPath,
        })
      }
    }
    return recentProjects
  }
  catch (e) {
    throw new Error(String(e))
  }
}

const preferences = getPreferenceValues<Preferences.Vscode>()
export const vscodeAdapter: Adapter = {
  appName: 'Visual Studio Code',
  appIcon: 'icons/vscode.png',
  appExePath: preferences.vscodeExePath,
  getRecentProjects: () => getVSCodeLikeRecentProjects({
    appName: 'Visual Studio Code',
    appIcon: 'icons/vscode.png',
    appExePath: preferences.vscodeExePath,
    appStoragePath: preferences.vscodeStoragePath,
  }),
}
