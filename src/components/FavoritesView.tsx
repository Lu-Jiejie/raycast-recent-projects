import type { Adapter, Project } from '../types'
import { useMemo } from 'react'
import { useApp } from '../logic/useApp'
import { useFavorites } from '../logic/useFavorites'
import { RecentProjectsList } from './RecentProjectsList'

interface FavoritesViewProps {
  adapter: Adapter
  appName: string
  searchBarPlaceholder?: string
  openTitle: string
  openIcon: string
}

export function FavoritesView({
  adapter,
  appName,
  searchBarPlaceholder = 'Search favorite projects...',
  openTitle,
  openIcon,
}: FavoritesViewProps) {
  const {
    projects: recentProjects,
    handleCopyPath,
    handleOpenProject,
  } = useApp(adapter, appName)

  const {
    favorites,
    toggleFavorite,
  } = useFavorites(appName)

  const favoriteProjects = useMemo(() => {
    return recentProjects
      .filter((project: Project) => favorites.includes(project.path))
      .map((project: Project) => ({
        ...project,
        isFavorite: true,
      }))
  }, [recentProjects, favorites])

  return (
    <RecentProjectsList
      projects={favoriteProjects}
      isLoading={false}
      onOpen={handleOpenProject}
      onCopy={handleCopyPath}
      onToggleFavorite={toggleFavorite}
      searchBarPlaceholder={searchBarPlaceholder}
      openTitle={openTitle}
      openIcon={openIcon}
      emptyTitle="No favorite projects"
      emptyDescription="Add projects to favorites from the recent projects list"
    />
  )
}
