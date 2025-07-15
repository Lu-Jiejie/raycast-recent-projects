import type { Project } from '../types'
import { useMemo } from 'react'

export function useProjectFilter(
  favoriteProjects: Project[],
  regularProjects: Project[],
  searchText: string,
) {
  return useMemo(() => {
    if (!searchText.trim()) {
      return {
        filteredFavorites: favoriteProjects,
        filteredRegulars: regularProjects,
        totalItems: favoriteProjects.length + regularProjects.length,
      }
    }

    const searchLower = searchText.toLowerCase()
    const filter = (item: Project) =>
      item.name.toLowerCase().includes(searchLower)
      || item.path.toLowerCase().includes(searchLower)

    const filteredFavorites = favoriteProjects.filter(filter)
    const filteredRegulars = regularProjects.filter(filter)

    return {
      filteredFavorites,
      filteredRegulars,
      totalItems: filteredFavorites.length + filteredRegulars.length,
    }
  }, [favoriteProjects, regularProjects, searchText])
}
