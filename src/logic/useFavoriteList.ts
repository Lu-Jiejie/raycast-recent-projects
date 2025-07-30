import type { FavoriteItem, Project } from '../types'
import { LocalStorage } from '@raycast/api'
import { useCallback, useEffect, useState } from 'react'

export function useFavoriteList() {
  const [favoriteList, setFavoriteList] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const storageKey = 'all-favorites'

  // 从本地存储加载收藏夹
  useEffect(() => {
    async function loadFavoriteList() {
      try {
        const stored = await LocalStorage.getItem<string>(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored) as FavoriteItem[]
          setFavoriteList(parsed)
        }
      }
      catch (e) {
        setFavoriteList([])
        throw new Error(String(e))
      }
      finally {
        setIsLoading(false)
      }
    }
    loadFavoriteList()
  }, [storageKey])

  // 保存收藏夹到本地存储
  const saveFavoriteList = useCallback(async (newFavoriteList: FavoriteItem[]) => {
    try {
      await LocalStorage.setItem(storageKey, JSON.stringify(newFavoriteList))
      setFavoriteList(newFavoriteList)
    }
    catch (error) {
      throw new Error(String(error))
    }
  }, [storageKey])

  // 获取特定应用的收藏夹路径列表
  const getFavoriteListByApp = useCallback((appName: string) => {
    return favoriteList
      .filter(item => item.appName === appName)
      .map(item => item.path)
  }, [favoriteList])

  const isFavorite = useCallback((appName: string, path: string) => {
    return favoriteList.some(item => item.appName === appName && item.path === path)
  }, [favoriteList])

  const addToFavoriteList = useCallback(async (project: Project) => {
    if (!isFavorite(project.appName, project.path)) {
      const newFavoriteItem: FavoriteItem = {
        name: project.name,
        appName: project.appName,
        path: project.path,
        icon: project.appIcon,
      }
      const newFavoriteList = [newFavoriteItem, ...favoriteList]
      await saveFavoriteList(newFavoriteList)
    }
  }, [favoriteList, isFavorite, saveFavoriteList])

  const removeFromFavoriteList = useCallback(async (appName: string, path: string) => {
    const newFavoriteList = favoriteList.filter(
      item => !(item.appName === appName && item.path === path),
    )
    await saveFavoriteList(newFavoriteList)
  }, [favoriteList, saveFavoriteList])

  const toggleFavorite = useCallback(async (project: Project) => {
    if (isFavorite(project.appName, project.path)) {
      await removeFromFavoriteList(project.appName, project.path)
    }
    else {
      await addToFavoriteList(project)
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
  }
}
