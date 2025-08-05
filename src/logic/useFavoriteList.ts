import type { FavoriteItem, Project } from '../types'
import { LocalStorage } from '@raycast/api'
import { useCallback, useEffect, useState } from 'react'
import { withErrorHandling } from '.'

type FavoriteListError
  = | { title: 'Failed to Load Favorite List', message: string }
    | { title: 'Failed to Save Favorite List', message: string }

export function useFavoriteList() {
  const [favoriteList, setFavoriteList] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const storageKey = 'all-favorites'
  const [error, setError] = useState<FavoriteListError | null>(null)

  // 从本地存储加载收藏夹
  useEffect(() => {
    async function loadFavoriteList() {
      const res = await withErrorHandling(
        async () => {
          const stored = await LocalStorage.getItem<string>(storageKey)
          if (stored) {
            const parsed = JSON.parse(stored) as FavoriteItem[]
            setFavoriteList(parsed)
          }
        },
      )
      if (!res.ok) {
        setError({ title: 'Failed to Load Favorite List', message: res.error })
        setFavoriteList([])
        setIsLoading(false)
        return
      }

      setError(null)
      setIsLoading(false)
    }

    loadFavoriteList()
  }, [storageKey])

  // 保存收藏夹到本地存储
  const saveFavoriteList = useCallback(async (newFavoriteList: FavoriteItem[]) => {
    const res = await withErrorHandling(
      async () => {
        await LocalStorage.setItem(storageKey, JSON.stringify(newFavoriteList))
        setFavoriteList(newFavoriteList)
      },
    )
    if (!res.ok) {
      setError({ title: 'Failed to Save Favorite List', message: res.error })
    }
  }, [storageKey])

  // 获取特定应用的收藏夹路径列表
  const getFavoriteListByApp = useCallback((appName: string) => {
    return favoriteList
      .filter(item => item.appName === appName)
      .map(item => item.id)
  }, [favoriteList])

  const isFavorite = useCallback((project: Project) => {
    return favoriteList.some(item => item.id === project.id)
  }, [favoriteList])

  const addToFavoriteList = useCallback(async (project: Project) => {
    if (!isFavorite(project)) {
      const { isFavorite, ...newFavoriteItem } = project
      const newFavoriteList = [newFavoriteItem, ...favoriteList]

      await saveFavoriteList(newFavoriteList)
    }
  }, [favoriteList, isFavorite, saveFavoriteList])

  const removeFromFavoriteList = useCallback(async (appName: string, id: string) => {
    const newFavoriteList = favoriteList.filter(
      item => !(item.appName === appName && item.id === id),
    )
    await saveFavoriteList(newFavoriteList)
  }, [favoriteList, saveFavoriteList])

  /**
   * Return true if the project was added to favorites, false if it was removed.
   */
  const toggleFavorite = useCallback(async (project: Project) => {
    if (isFavorite(project)) {
      await removeFromFavoriteList(project.appName, project.path)
      return false
    }
    else {
      await addToFavoriteList(project)
      return true
    }
  }, [isFavorite, addToFavoriteList, removeFromFavoriteList])

  return {
    favoriteList,
    isFavorite,
    toggleFavorite,
    addToFavoriteList,
    removeFromFavoriteList,
    getFavoriteListByApp,
    isLoading,
    error,
  }
}
