import type { Project } from '../types'
import { Buffer } from 'node:buffer'
import * as os from 'node:os'
import * as path from 'node:path'
import { exists, readFile } from 'fs-extra'
import { toUnixPath } from '../logic'

interface TyporaSettings {
  recentFolder?: Array<{ path: string, date: string }>
  recentDocument?: Array<{ path: string, date: number }>
}

export async function fetchTyporaProjects({
  appName,
  appIcon,
  appExePath,
  hideNotExistItems,
}: {
  appName: string
  appIcon: string
  appExePath: string
  hideNotExistItems: boolean
}): Promise<Project[]> {
  const typoraStoragePath = path.join(os.homedir(), 'AppData', 'Roaming', 'Typora', 'history.data')

  if (!(await exists(typoraStoragePath))) {
    console.error(`Typora settings file not found: ${typoraStoragePath}`)
    return []
  }

  const settingsContentHex = await readFile(typoraStoragePath, 'utf-8')
  const settingsContentBuffer = Buffer.from(settingsContentHex, 'hex')
  const settingsContentJson = settingsContentBuffer.toString('utf8')
  const settings: TyporaSettings = JSON.parse(settingsContentJson)

  const allItems: Array<{ path: string, timestamp: number }> = []

  if (settings.recentFolder) {
    for (const folder of settings.recentFolder) {
      if (folder.path && folder.date) {
        const timestamp = new Date(folder.date.replace('Z', '+00:00')).getTime()
        allItems.push({ path: folder.path, timestamp })
      }
    }
  }

  if (settings.recentDocument) {
    for (const document of settings.recentDocument) {
      if (document.path && document.date) {
        const timestamp = document.date // Typora stores date as milliseconds since epoch for documents
        allItems.push({ path: document.path, timestamp })
      }
    }
  }

  allItems.sort((a, b) => b.timestamp - a.timestamp)

  const recentProjects: Project[] = []
  for (const item of allItems) {
    const projectPath = toUnixPath(item.path)

    if (hideNotExistItems) {
      if (!(await exists(projectPath))) {
        continue
      }
    }

    recentProjects.push({
      type: 'workspace', // Typora deals with files/folders, treating them as 'file' type in this context
      appName,
      name: path.basename(projectPath),
      path: projectPath,
      appExePath,
      icon: appIcon,
      id: `${appName}-${projectPath}`,
    })
  }

  return recentProjects
}
