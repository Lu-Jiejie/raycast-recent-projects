import type { Adapter } from '../adapters'
import type { Project } from '../types'
import { List } from '@raycast/api'
import { useMemo, useState } from 'react'
import { useProjectList } from '../logic/useProjectList'
import { ProjectListItem } from './ProjectListItem'

interface ProjectListProps {
  adapter: Adapter
  searchBarPlaceholder?: string
}

export function ProjectList({
  adapter,
  searchBarPlaceholder,
}: ProjectListProps) {
  const [searchText, setSearchText] = useState('')

  const {
    favoriteProjects,
    regularProjects,
    isLoading,
    handleToggleFavorite,
  } = useProjectList(adapter)

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
