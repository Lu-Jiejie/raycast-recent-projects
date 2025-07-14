import type { Adapter, Project } from '../types'
import { showToast, Toast } from '@raycast/api'
import { useCallback, useMemo } from 'react'
import { useApp } from '../logic/useApp'
import { useFavorites } from '../logic/useFavorites'
import { RecentProjectsList } from './RecentProjectsList'

interface AppViewProps {
  adapter: Adapter
  appName: string
  searchBarPlaceholder: string
  openTitle: string
  openIcon: string
  showFavoritesFirst?: boolean
}

export function AppView({
  adapter,
  appName,
  searchBarPlaceholder,
  openTitle,
  openIcon,
  showFavoritesFirst = false,
}: AppViewProps) {
  const {
    projects,
    isLoading,
    handleCopyPath,
    handleOpenProject,
  } = useApp(adapter, appName)

  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites()

  // 合并最近项目和收藏状态
  const enhancedProjects = useMemo(() => {
    return projects.map((project: Project) => ({
      ...project,
      isFavorite: isFavorite(appName, project.path),
    }))
  }, [projects, isFavorite, appName])

  // 根据设置排序项目（收藏夹优先或正常顺序）
  const sortedProjects = useMemo(() => {
    if (!showFavoritesFirst) {
      return enhancedProjects
    }

    const favoriteProjects = enhancedProjects.filter((p: Project & { isFavorite: boolean }) => p.isFavorite)
    const nonFavoriteProjects = enhancedProjects.filter((p: Project & { isFavorite: boolean }) => !p.isFavorite)

    return [...favoriteProjects, ...nonFavoriteProjects]
  }, [enhancedProjects, showFavoritesFirst])

  // 处理收藏夹切换
  const handleToggleFavorite = useCallback(async (project: Project) => {
    try {
      await toggleFavorite(appName, project.path)
      const action = isFavorite(appName, project.path) ? 'removed from' : 'added to'
      await showToast({
        style: Toast.Style.Success,
        title: `Project ${action} favorites`,
        message: project.name,
      })
    }
    catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to update favorites',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  }, [toggleFavorite, isFavorite, appName])

  return (
    <RecentProjectsList
      projects={sortedProjects}
      isLoading={isLoading}
      onOpen={handleOpenProject}
      onCopy={handleCopyPath}
      onToggleFavorite={handleToggleFavorite}
      searchBarPlaceholder={searchBarPlaceholder}
      openTitle={openTitle}
      openIcon={openIcon}
    />
  )
}
