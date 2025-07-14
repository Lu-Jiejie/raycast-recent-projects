import type { Project } from './types'
import { showToast, Toast } from '@raycast/api'
import { useEffect, useState } from 'react'
import { vscodeAdapter } from './adapters/vscode'
import { RecentProjectsList } from './components/RecentProjectsList'

async function loadData(): Promise<Project[]> {
  try {
    const projects = vscodeAdapter.getRecentProjects()
    return projects
  }
  catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: 'Failed to Load Projects',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    })
    return []
  }
}

export default function Command() {
  const [items, setItems] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const data = await loadData()
      setItems(data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  // 复制项目路径
  async function handleCopyPath(item: Project) {
    await showToast({
      style: Toast.Style.Success,
      title: 'Copied Project Path',
      message: item.path,
    })
  }

  // 用 VSCode 打开项目
  async function handleOpenProject(item: Project) {
    try {
      vscodeAdapter.openProject(item.path)
      await showToast({
        style: Toast.Style.Success,
        title: 'Opened in VSCode',
        message: item.name,
      })
    }
    catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Open Failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  }

  return (
    <RecentProjectsList
      projects={items}
      isLoading={isLoading}
      onOpen={handleOpenProject}
      onCopy={handleCopyPath}
      searchBarPlaceholder="Search recent projects for Visual Studio Code..."
      openTitle="Open in VSCode"
    />
  )
}
