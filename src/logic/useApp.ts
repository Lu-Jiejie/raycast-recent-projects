import type { Adapter, Project } from '../types'
import { showToast, Toast } from '@raycast/api'
import { useEffect, useState } from 'react'

export function useApp(adapter: Adapter, appName: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const data = adapter.getRecentProjects()
        setProjects(data)
      }
      catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: 'Failed to Load Projects',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        })
        setProjects([])
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [adapter])

  // 复制项目路径
  async function handleCopyPath(item: Project) {
    await showToast({
      style: Toast.Style.Success,
      title: 'Copied Project Path',
      message: item.path,
    })
  }

  // 打开项目
  async function handleOpenProject(item: Project) {
    try {
      adapter.openProject(item.path)
      await showToast({
        style: Toast.Style.Success,
        title: `Opened in ${appName}`,
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

  return {
    projects,
    isLoading,
    handleCopyPath,
    handleOpenProject,
  }
}
