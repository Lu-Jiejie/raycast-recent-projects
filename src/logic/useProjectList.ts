import type { Adapter, Project } from '../types'
import { useEffect, useMemo, useState } from 'react'
import { showErrorToast, withErrorHandling } from '.'
import { useFavoriteList } from './useFavoriteList'
import { useHiddenList } from './useHiddenList'

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

  const {
    isHidden,
    toggleHidden,
    isLoading: hiddenListLoading,
    error: hiddenListError,
  } = useHiddenList()

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

  useEffect(() => {
    if (hiddenListError) {
      showErrorToast(
        hiddenListError.title,
        hiddenListError.message,
      )
    }
  }, [hiddenListError])

  const groupedProjects = useMemo(() => {
    if (favoriteListLoading || hiddenListLoading) {
      return {
        favoriteProjects: [],
        regularProjects: [],
        hiddenProjects: [],
        isReady: false,
      }
    }

    let enhancedProjects = rawProjects.map(project => ({
      ...project,
      isFavorite: isFavorite(project),
      isHidden: isHidden(project),
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

    const [favoriteProjects, regularAndHidden] = enhancedProjects.reduce<[Project[], Project[]]>(
      ([f, r], p) => {
        return p.isFavorite
          ? [[...f, p], r]
          : [f, [...r, p]]
      },
      [[], []],
    )

    const [regularProjects, hiddenProjects] = regularAndHidden.reduce<[Project[], Project[]]>(
      ([v, h], p) => {
        return p.isHidden
          ? [v, [...h, p]]
          : [[...v, p], h]
      },
      [[], []],
    )

    return {
      favoriteProjects,
      regularProjects,
      hiddenProjects,
      isReady: true,
    }
  }, [rawProjects, isFavorite, isHidden, adapter.appName, favoriteListLoading, hiddenListLoading])

  return {
    favoriteProjects: groupedProjects.favoriteProjects,
    regularProjects: groupedProjects.regularProjects,
    hiddenProjects: groupedProjects.hiddenProjects,
    isLoading: isLoading || favoriteListLoading || hiddenListLoading || !groupedProjects.isReady,
    toggleFavorite,
    toggleHidden,
    isHidden,
    error,
  }
}
