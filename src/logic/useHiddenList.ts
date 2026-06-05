import type { Project } from '../types'
import { LocalStorage } from '@raycast/api'
import { useCallback, useEffect, useState } from 'react'
import { withErrorHandling } from '.'

type HiddenListError
  = | { title: 'Failed to Load Hidden List', message: string }
    | { title: 'Failed to Save Hidden List', message: string }

export function useHiddenList() {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const storageKey = 'all-hidden'
  const [error, setError] = useState<HiddenListError | null>(null)

  useEffect(() => {
    async function load() {
      const res = await withErrorHandling(async () => {
        const stored = await LocalStorage.getItem<string>(storageKey)
        if (stored) {
          const ids = JSON.parse(stored) as string[]
          setHiddenIds(new Set(ids))
        }
      })
      if (!res.ok) {
        setError({ title: 'Failed to Load Hidden List', message: res.error })
      }
      else {
        setError(null)
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const save = useCallback(async (ids: Set<string>) => {
    const res = await withErrorHandling(async () => {
      await LocalStorage.setItem(storageKey, JSON.stringify([...ids]))
      setHiddenIds(ids)
    })
    if (!res.ok) {
      setError({ title: 'Failed to Save Hidden List', message: res.error })
    }
  }, [])

  const isHidden = useCallback((project: Project) => {
    return hiddenIds.has(project.id)
  }, [hiddenIds])

  const toggleHidden = useCallback(async (project: Project) => {
    const next = new Set(hiddenIds)
    if (next.has(project.id))
      next.delete(project.id)
    else
      next.add(project.id)
    await save(next)
    return !hiddenIds.has(project.id)
  }, [hiddenIds, save])

  return { isHidden, toggleHidden, isLoading, error }
}
