import type { Image } from '@raycast/api'
import type { Project } from '../types'
import { LocalStorage } from '@raycast/api'
import { getFavicon as rawGetFavicon } from '@raycast/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  }
  catch {
    return ''
  }
}

const FAVICON_CACHE_KEY = 'bookmark-favicons'
export function useFavicons(bookmarks: Project[]) {
  const [favicons, setFavicons] = useState<Record<string, Image.ImageLike>>({})
  const [isLoading, setIsLoading] = useState(true)
  const faviconCache = useRef<Record<string, string | Image.ImageLike> | null>(null)
  const bookmarkData = useMemo(() => {
    return bookmarks.map(bookmark => ({
      id: bookmark.id,
      path: bookmark.path,
    }))
  }, [bookmarks])

  const saveCache = useCallback(async () => {
    if (faviconCache.current) {
      try {
        await LocalStorage.setItem(FAVICON_CACHE_KEY, JSON.stringify(faviconCache.current))
      }
      catch (err) {
        console.error('Failed to save favicon cache', err)
      }
    }
  }, [])

  const getFaviconWithoutSave = useCallback(async (url: string) => {
    try {
      const domain = getDomain(url)
      if (!domain) {
        return ''
      }

      if (!faviconCache.current) {
        const cachedData = await LocalStorage.getItem<string>(FAVICON_CACHE_KEY)
        faviconCache.current = cachedData ? JSON.parse(cachedData) : {}
      }

      if (faviconCache.current![domain]) {
        return faviconCache.current![domain]
      }

      const favicon = rawGetFavicon(url, {
        fallback: '',
      })

      faviconCache.current![domain] = favicon
      return favicon
    }
    catch (error) {
      console.error('Error in getFaviconWithoutSave:', error)
      return ''
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    const needFetchIds = bookmarkData.filter(bookmark => !favicons[bookmark.id]).map(b => b.id)

    if (needFetchIds.length === 0) {
      setIsLoading(false)
      return
    }

    async function fetchFavicons() {
      // await LocalStorage.removeItem(FAVICON_CACHE_KEY)
      try {
        const needFetchBookmarks = bookmarkData.filter(bookmark => !favicons[bookmark.id])

        const entries = await Promise.all(
          needFetchBookmarks.map(async (bookmark) => {
            const favicon = await getFaviconWithoutSave(bookmark.path)
            return [bookmark.id, favicon] as const
          }),
        )

        if (isMounted) {
          setFavicons(prev => ({
            ...prev,
            ...Object.fromEntries(entries),
          }))

          await saveCache()

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
  }, [bookmarkData, getFaviconWithoutSave, saveCache])

  return {
    favicons,
    isLoading,
  }
}
