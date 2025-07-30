import type { Adapter } from '../adapters'
import type { Project } from '../types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { showSuccessToast, withErrorHandling } from '.'
import { useFavoriteList } from './useFavoriteList'

export function useProjectList(adapter: Adapter) {
  // 状态管理
  const [rawProjects, setRawProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 配置和依赖
  const { isFavorite, toggleFavorite, isLoading: favoriteListLoading } = useFavoriteList()

  // 获取项目数据
  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true)

      const data = await withErrorHandling(
        () => adapter.getRecentProjects(),
        errorMessage => ({
          title: `Failed to Load Recent Projects`,
          message: errorMessage,
        }),
      )

      setRawProjects(data || [])
      setIsLoading(false)
    }

    fetchProjects()
  }, [adapter])

  // 合并收藏状态并分组
  const groupedProjects = useMemo(() => {
    // 如果收藏数据还在加载，返回空分组避免中间状态
    if (favoriteListLoading) {
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
      ([f, r], p) => {
        return p.isFavorite
          ? [[...f, p], r]
          : [f, [...r, p]]
      },
      [[], []],
    )

    return {
      favoriteProjects,
      regularProjects,
      isReady: true,
    }
  }, [rawProjects, isFavorite, adapter.appName, favoriteListLoading])

  const handleToggleFavorite = useCallback(async (project: Project) => {
    const success = await withErrorHandling(
      async () => {
        const wasAlreadyFavorite = isFavorite(adapter.appName, project.path)
        await toggleFavorite(project)
        return wasAlreadyFavorite ? 'removed from' : 'added to'
      },
      errorMessage => ({
        title: `Failed to update favorite list`,
        message: errorMessage,
      }),
    )

    if (success) {
      await showSuccessToast(`Project ${success} favorite list`, project.name)
    }
  }, [isFavorite, toggleFavorite, adapter.appName])

  return {
    favoriteProjects: groupedProjects.favoriteProjects,
    regularProjects: groupedProjects.regularProjects,
    isLoading: isLoading || favoriteListLoading || !groupedProjects.isReady,
    handleToggleFavorite,
  }
}
