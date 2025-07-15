import type { Adapter } from '../adapters'
import type { Project } from '../types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast } from '.'
import { useFavorites } from './useFavorites'

export function useApp(adapter: Adapter) {
  // 状态管理
  const [rawProjects, setRawProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 配置和依赖
  const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useFavorites()

  // 获取项目数据
  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true)

      try {
        const data = adapter.getRecentProjects()
        setRawProjects(data)
      }
      catch (error) {
        await showErrorToast('Failed to Load Projects', error instanceof Error ? error.message : 'Unknown error occurred')
        setRawProjects([])
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [adapter])

  // 合并收藏状态并分组
  const groupedProjects = useMemo(() => {
    // 如果收藏数据还在加载，返回空分组避免中间状态
    if (favoritesLoading) {
      return {
        favoriteProjects: [],
        regularProjects: [],
        isReady: false,
      }
    }

    // 合并收藏状态
    const enhancedProjects = rawProjects.map(project => ({
      ...project,
      isFavorite: isFavorite(adapter.appName, project.path),
    }))

    // 分组
    const favorites: Project[] = []
    const regulars: Project[] = []

    enhancedProjects.forEach((project) => {
      if (project.isFavorite) {
        favorites.push(project)
      }
      else {
        regulars.push(project)
      }
    })

    return {
      favoriteProjects: favorites,
      regularProjects: regulars,
      isReady: true,
    }
  }, [rawProjects, isFavorite, adapter.appName, favoritesLoading])

  const handleCopyPath = useCallback(async (item: Project) => {
    await showSuccessToast('Copied Project Path', item.path)
  }, [])

  const handleOpenProject = useCallback(async (item: Project) => {
    try {
      adapter.openProject(item.path)
      await showSuccessToast(`Opened in ${adapter.appName}`, item.name)
    }
    catch (error) {
      await showErrorToast('Open Failed', error instanceof Error ? error.message : 'Unknown error occurred')
    }
  }, [adapter])

  const handleToggleFavorite = useCallback(async (project: Project) => {
    try {
      const wasAlreadyFavorite = isFavorite(adapter.appName, project.path)
      await toggleFavorite(adapter.appName, project.path)
      const action = wasAlreadyFavorite ? 'removed from' : 'added to'
      await showSuccessToast(`Project ${action} favorites`, project.name)
    }
    catch (error) {
      await showErrorToast('Failed to update favorites', error instanceof Error ? error.message : 'Unknown error occurred')
    }
  }, [isFavorite, toggleFavorite, adapter.appName])

  return {
    favoriteProjects: groupedProjects.favoriteProjects,
    regularProjects: groupedProjects.regularProjects,
    isLoading: isLoading || favoritesLoading || !groupedProjects.isReady,
    handleCopyPath,
    handleOpenProject,
    handleToggleFavorite,
  }
}
