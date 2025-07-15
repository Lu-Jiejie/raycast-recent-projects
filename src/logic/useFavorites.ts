import { LocalStorage } from '@raycast/api'
import { useCallback, useEffect, useState } from 'react'

export interface FavoriteItem {
  appName: string
  path: string
}

export function useFavorites() {
  const [allFavorites, setAllFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const storageKey = 'all-favorites'

  // 从本地存储加载收藏夹
  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await LocalStorage.getItem<string>(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored) as FavoriteItem[]
          setAllFavorites(parsed)
        }
      }
      catch (error) {
        console.error('Failed to load favorites:', error)
        setAllFavorites([])
      }
      finally {
        setIsLoading(false)
      }
    }
    loadFavorites()
  }, [storageKey])

  // 保存收藏夹到本地存储
  const saveFavorites = useCallback(async (newFavorites: FavoriteItem[]) => {
    try {
      await LocalStorage.setItem(storageKey, JSON.stringify(newFavorites))
      setAllFavorites(newFavorites)
    }
    catch (error) {
      console.error('Failed to save favorites:', error)
    }
  }, [storageKey])

  // 获取特定应用的收藏夹路径列表
  const getFavoritesByApp = useCallback((appName: string) => {
    return allFavorites
      .filter(item => item.appName === appName)
      .map(item => item.path)
  }, [allFavorites])

  const isFavorite = useCallback((appName: string, path: string) => {
    return allFavorites.some(item => item.appName === appName && item.path === path)
  }, [allFavorites])

  const addToFavorites = useCallback(async (appName: string, path: string) => {
    if (!isFavorite(appName, path)) {
      const newFavoriteItem: FavoriteItem = {
        appName,
        path,
      }
      const newFavorites = [newFavoriteItem, ...allFavorites]
      await saveFavorites(newFavorites)
    }
  }, [allFavorites, isFavorite, saveFavorites])

  const removeFromFavorites = useCallback(async (appName: string, path: string) => {
    const newFavorites = allFavorites.filter(
      item => !(item.appName === appName && item.path === path),
    )
    await saveFavorites(newFavorites)
  }, [allFavorites, saveFavorites])

  const toggleFavorite = useCallback(async (appName: string, path: string) => {
    if (isFavorite(appName, path)) {
      await removeFromFavorites(appName, path)
    }
    else {
      await addToFavorites(appName, path)
    }
  }, [isFavorite, addToFavorites, removeFromFavorites])

  return {
    allFavorites,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    getFavoritesByApp,
    isLoading,
  }
}
