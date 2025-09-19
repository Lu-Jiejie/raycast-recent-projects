import type { Adapter, Project } from '../types'
import { useEffect, useMemo, useState } from 'react'
import { showErrorToast, withErrorHandling } from '.'
import { useFavoriteList } from './useFavoriteList'

type ProjectListError
  = | { title: 'Failed to Load Recent Projects', message: string }

export function useProjectList(adapter: Adapter, _type: 'workspace' | 'bookmark' = 'workspace') {
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

  const groupedProjects = useMemo(() => {
    // if loading favorites, return empty lists
    if (favoriteListLoading) {
      return {
        favoriteProjects: [],
        regularProjects: [],
        isReady: false,
      }
    }

    // combine favorite status and sort if needed
    let enhancedProjects = rawProjects.map(project => ({
      ...project,
      isFavorite: isFavorite(project),
    }))

    // sort by date if bookmark type
    if (_type === 'bookmark') {
      enhancedProjects = [...enhancedProjects].sort((a, b) => {
        if (!a.date) {
          return 1
        }
        if (!b.date) {
          return -1
        }

        // 直接比较字符串时间戳（假设格式一致且都是数字字符串）
        // 对于像 "13361573574571701" 这样的数字字符串，直接比较字符串通常能得到正确结果
        // 如果长度相同，字符串比较会按字典序比较，数字字符串则会得到正确的数值顺序
        if (a.date.length === b.date.length) {
          return b.date.localeCompare(a.date) // 降序排列
        }

        // 如果长度不同，先比较长度（更长的数字更大）
        return b.date.length - a.date.length
      })
    }

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
