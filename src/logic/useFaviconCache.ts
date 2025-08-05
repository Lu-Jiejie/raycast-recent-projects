import type { Image } from '@raycast/api'
import { LocalStorage } from '@raycast/api'
import { getFavicon as rawGetFavicon } from '@raycast/utils'
import { useRef } from 'react'

function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  }
  catch {
    return ''
  }
}

const FAVICON_CACHE_KEY = 'bookmark-favicons'
export function useFaviconCache() {
  const faviconCache = useRef<Record<string, string | Image.ImageLike> | null>(null)
  // LocalStorage.removeItem(FAVICON_CACHE_KEY)
  const getFavicon = async (url: string) => {
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
      LocalStorage.setItem(FAVICON_CACHE_KEY, JSON.stringify(faviconCache.current))
        .catch(err => console.error('Failed to save favicon cache', err))

      return favicon
    }
    catch (error) {
      console.error('Error in getFavicon:', error)
      return ''
    }
  }

  return { getFavicon }
}
