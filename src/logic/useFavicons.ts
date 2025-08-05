import type { Image } from '@raycast/api'
import type { Project } from '../types'
import { useEffect, useMemo, useState } from 'react'
import { useFaviconCache } from './useFaviconCache'

/**
 * 批量获取多个书签的 favicons，并以书签 ID 为键返回结果
 *
 * @param bookmarks 需要获取 favicon 的书签列表
 * @returns 一个以书签 ID 为键，favicon 为值的映射对象
 */
export function useFavicons(bookmarks: Project[]) {
  const [favicons, setFavicons] = useState<Record<string, Image.ImageLike>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { getFavicon } = useFaviconCache()

  // 获取需要处理的书签 URLs 和 IDs
  const bookmarkData = useMemo(() => {
    return bookmarks.map(bookmark => ({
      id: bookmark.id,
      path: bookmark.path,
    }))
  }, [bookmarks])

  // 只在书签列表变化时批量获取 favicon
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    // 检查是否有新书签需要获取 favicon
    const needFetchIds = bookmarkData.filter(bookmark => !favicons[bookmark.id]).map(b => b.id)

    // 如果没有新书签需要处理，直接返回
    if (needFetchIds.length === 0) {
      setIsLoading(false)
      return
    }

    // 批量获取所有需要的 favicon
    async function fetchFavicons() {
      try {
        // 只处理未缓存的书签
        const needFetchBookmarks = bookmarkData.filter(bookmark => !favicons[bookmark.id])

        const entries = await Promise.all(
          needFetchBookmarks.map(async (bookmark) => {
            const favicon = await getFavicon(bookmark.path)
            return [bookmark.id, favicon] as const
          }),
        )

        if (isMounted) {
          // 合并新获取的与已有的 favicons
          setFavicons(prev => ({
            ...prev,
            ...Object.fromEntries(entries),
          }))
          setIsLoading(false)
        }
      }
      catch (error) {
        console.error('Error fetching favicons:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchFavicons()

    return () => {
      isMounted = false
    }
  }, [bookmarkData, getFavicon])

  // 提供一个获取单个 favicon 的便捷方法
  const getFaviconById = (id: string): Image.ImageLike => {
    return favicons[id] || ''
  }

  return {
    favicons,
    getFaviconById,
    isLoading,
  }
}
