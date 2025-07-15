import type { Adapter } from '../adapters'
import type { Project } from '../types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast, withErrorHandling } from '.'
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

      const data = await withErrorHandling(
        () => adapter.getRecentProjects(),
        'Failed to Load Projects',
      )

      setRawProjects(data || [])
      setIsLoading(false)
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

    // 合并收藏状态并按收藏状态分组
    const enhancedProjects = rawProjects.map(project => ({
      ...project,
      isFavorite: isFavorite(adapter.appName, project.path),
    }))

    const [favoriteProjects, regularProjects] = enhancedProjects.reduce<[Project[], Project[]]>(
      ([favorites, regulars], project) => {
        return project.isFavorite
          ? [[...favorites, project], regulars]
          : [favorites, [...regulars, project]]
      },
      [[], []],
    )

    return {
      favoriteProjects,
      regularProjects,
      isReady: true,
    }
  }, [rawProjects, isFavorite, adapter.appName, favoritesLoading])

  const handleOpenProject = useCallback(async (item: Project) => {
    const success = await withErrorHandling(
      async () => {
        adapter.openProject(item.path)
        return true
      },
      'Open Failed',
    )

    if (success) {
      await showSuccessToast(`Opened in ${adapter.appName}`, item.name)
    }
  }, [adapter])

  const handleToggleFavorite = useCallback(async (project: Project) => {
    const success = await withErrorHandling(
      async () => {
        const wasAlreadyFavorite = isFavorite(adapter.appName, project.path)
        await toggleFavorite(project)
        return wasAlreadyFavorite ? 'removed from' : 'added to'
      },
      'Failed to update favorites',
    )

    if (success) {
      await showSuccessToast(`Project ${success} favorites`, project.name)
    }
  }, [isFavorite, toggleFavorite, adapter.appName])

  return {
    favoriteProjects: groupedProjects.favoriteProjects,
    regularProjects: groupedProjects.regularProjects,
    isLoading: isLoading || favoritesLoading || !groupedProjects.isReady,
    handleOpenProject,
    handleToggleFavorite,
  }
}
