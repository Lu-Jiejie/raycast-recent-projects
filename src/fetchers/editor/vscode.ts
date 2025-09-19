import type { Project } from '../../types'
import { executeSQL } from '@raycast/utils'
import { exists } from 'fs-extra'
import { toUnixPath } from '../../logic'
import { resolveAppExePath } from '../../logic/resolveAppExePath'

const QUERY = 'SELECT value FROM ItemTable WHERE key = \'history.recentlyOpenedPathsList\';'

export async function fetchVscodeLikeProjects({
  appName,
  appIcon,
  appExePath,
  appStoragePath,
  hideNotExistItems,
}: {
  appName: string
  appIcon: string
  appExePath: string
  appStoragePath: string
  hideNotExistItems: boolean
}): Promise<Project[]> {
  if (!appStoragePath) {
    throw new Error(`${appName} storage path is not set`)
  }

  appStoragePath = toUnixPath(appStoragePath)
  const queryRes = await executeSQL<{ value: string }>(appStoragePath, QUERY)
  const storageJson = JSON.parse(queryRes[0].value) as {
    entries: Array<{ folderUri: string }>
  }
  // VSCode 最近项目存储在 profileAssociations.workspaces 中
  const workspaceData = storageJson.entries
  const recentProjects: Project[] = []

  for (const workspaceKey of workspaceData) {
    if (!workspaceKey.folderUri)
      continue

    if (workspaceKey.folderUri.startsWith('file:///')) {
      let projectPath = workspaceKey.folderUri.replace('file:///', '')
      // URL 解码和路径格式转换
      projectPath = decodeURIComponent(projectPath)
      projectPath = projectPath.charAt(0).toUpperCase() + projectPath.slice(1)
      // 换为windows的斜杠
      // projectPath = projectPath.replace(/\//g, '\\')

      if (hideNotExistItems) {
        if (!(await exists(projectPath))) {
          continue
        }
      }

      recentProjects.push({
        type: 'workspace',
        appName,
        name: projectPath.split('/').pop() || projectPath,
        path: projectPath,
        appExePath: appExePath || await resolveAppExePath(appName),
        icon: appIcon,
        id: `${appName}-${projectPath}`,
      })
    }
  }
  return recentProjects
}
