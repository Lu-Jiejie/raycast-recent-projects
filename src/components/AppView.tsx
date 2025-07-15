import type { Adapter } from '../adapters'
import type { Project } from '../types'
import { Icon, List } from '@raycast/api'
import { useMemo, useState } from 'react'
import { useApp } from '../logic/useApp'
import { ProjectListItem } from './ProjectListItem'

interface AppViewProps {
  adapter: Adapter
  searchBarPlaceholder?: string
  openTitle?: string
  openIcon?: string
}

export function AppView({
  adapter,
  searchBarPlaceholder,
  openTitle,
}: AppViewProps) {
  const [searchText, setSearchText] = useState('')

  const {
    favoriteProjects,
    regularProjects,
    isLoading,
    handleOpenProject,
    handleToggleFavorite,
  } = useApp(adapter)

  // 过滤逻辑：根据搜索文本过滤项目
  const { filteredFavorites, filteredRegulars, totalItems } = useMemo(() => {
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

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={searchBarPlaceholder || `Search recent projects for ${adapter.appName}...`}
      throttle={true}
    >
      {totalItems === 0 && !isLoading
        ? (
            <List.EmptyView
              // icon={Icon.MagnifyingGlass}
              title="No projects found"
              description="No recent projects or no matches"
            />
          )
        : (
            <>
              {filteredFavorites.length > 0 && (
                <List.Section title="Favorites" subtitle={`${filteredFavorites.length} projects`}>
                  {filteredFavorites.map(item => (
                    <ProjectListItem
                      key={item.path}
                      project={item}
                      openTitle={openTitle}
                      onOpenProject={handleOpenProject}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </List.Section>
              )}

              {filteredRegulars.length > 0 && (
                <List.Section title="Recent Projects" subtitle={`${filteredRegulars.length} projects`}>
                  {filteredRegulars.map(item => (
                    <ProjectListItem
                      key={item.path}
                      project={item}
                      openTitle={openTitle}
                      onOpenProject={handleOpenProject}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </List.Section>
              )}
            </>
          )}
    </List>
  )
}
