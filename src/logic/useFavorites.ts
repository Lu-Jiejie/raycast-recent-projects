import type { Project } from '../types'
import { LocalStorage } from '@raycast/api'
import { useCallback, useEffect, useState } from 'react'

interface FavoritesHook {
  favorites: string[] // 存储项目路径
  isFavorite: (path: string) => boolean
  toggleFavorite: (project: Project) => Promise<void>
  addToFavorites: (project: Project) => Promise<void>
  removeFromFavorites: (path: string) => Promise<void>
}

export function useFavorites(appName: string): FavoritesHook {
  const [favorites, setFavorites] = useState<string[]>([])
  const storageKey = `favorites-${appName.toLowerCase()}`

  // 从本地存储加载收藏夹
  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await LocalStorage.getItem<string>(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored) as string[]
          setFavorites(parsed)
        }
      }
      catch (error) {
        console.error('Failed to load favorites:', error)
        setFavorites([])
      }
    }
    loadFavorites()
  }, [storageKey])

  // 保存收藏夹到本地存储
  const saveFavorites = useCallback(async (newFavorites: string[]) => {
    try {
      await LocalStorage.setItem(storageKey, JSON.stringify(newFavorites))
      setFavorites(newFavorites)
    }
    catch (error) {
      console.error('Failed to save favorites:', error)
    }
  }, [storageKey])

  const isFavorite = useCallback((path: string) => {
    return favorites.includes(path)
  }, [favorites])

  const addToFavorites = useCallback(async (project: Project) => {
    if (!favorites.includes(project.path)) {
      const newFavorites = [...favorites, project.path]
      await saveFavorites(newFavorites)
    }
  }, [favorites, saveFavorites])

  const removeFromFavorites = useCallback(async (path: string) => {
    const newFavorites = favorites.filter(fav => fav !== path)
    await saveFavorites(newFavorites)
  }, [favorites, saveFavorites])

  const toggleFavorite = useCallback(async (project: Project) => {
    if (isFavorite(project.path)) {
      await removeFromFavorites(project.path)
    }
    else {
      await addToFavorites(project)
    }
  }, [isFavorite, addToFavorites, removeFromFavorites])

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
  }
}
