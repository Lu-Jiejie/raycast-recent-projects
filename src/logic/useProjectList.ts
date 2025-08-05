import type { Adapter } from '../adapters'
import type { Project } from '../types'
import { useEffect, useMemo, useState } from 'react'
import { showErrorToast, withErrorHandling } from '.'
import { useFavoriteList } from './useFavoriteList'

type ProjectListError
  = | { title: 'Failed to Load Recent Projects', message: string }

export function useProjectList(adapter: Adapter) {
  const [rawProjects, setRawProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ProjectListError | null>(null)

  const {
    isFavorite,
    toggleFavorite,
    isLoading: favoriteListLoading,
    error: favoriteListError,
  } = useFavoriteList()

  useEffect(() => {
    let isMounted = true

    async function loadRawProjects() {
      setIsLoading(true)

      const result = await withErrorHandling(
        () => adapter.getRecentProjects(),
      )

      // 如果组件已卸载，不更新状态
      if (!isMounted)
        return

      if (!result.ok) {
        setError({
          title: 'Failed to Load Recent Projects',
          message: result.error,
        })
        setIsLoading(false)
        return
      }

      setError(null)
      setRawProjects(result.data || [])
      setIsLoading(false)
    }

    loadRawProjects()

    return () => {
      isMounted = false
    }
  }, [adapter])

  useEffect(() => {
    if (favoriteListError) {
      showErrorToast(
        favoriteListError.title,
        favoriteListError.message,
      )
    }
  }, [favoriteListError])

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
      isFavorite: isFavorite(project),
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

  return {
    favoriteProjects: groupedProjects.favoriteProjects,
    regularProjects: groupedProjects.regularProjects,
    isLoading: isLoading || favoriteListLoading || !groupedProjects.isReady,
    toggleFavorite,
    error,
  }
}
