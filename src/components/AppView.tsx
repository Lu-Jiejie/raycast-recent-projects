import type { Adapter } from '../adapters'
import { Icon, List } from '@raycast/api'
import { useState } from 'react'
import { useApp } from '../logic/useApp'
import { useProjectFilter } from '../logic/useProjectFilter'
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

  const { filteredFavorites, filteredRegulars, totalItems } = useProjectFilter(
    favoriteProjects,
    regularProjects,
    searchText,
  )

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
