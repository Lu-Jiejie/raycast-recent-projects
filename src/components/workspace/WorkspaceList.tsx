import type { Adapter } from '../../adapters'
import type { Project } from '../../types'
import { Action, ActionPanel, List, openExtensionPreferences } from '@raycast/api'
import { useEffect, useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast } from '../../logic'
import { useProjectList } from '../../logic/useProjectList'
import { ProjectListItem } from './WorkspaceListItem'

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
    toggleFavorite,
    error,
  } = useProjectList(adapter)

  useEffect(() => {
    if (error) {
      showErrorToast(
        error.title,
        error.message,
      )
    }
  }, [error])

  const { filteredFavorites, filteredRegulars, totalItems } = useMemo(() => {
    if (!searchText.trim()) {
      return {
        filteredFavorites: favoriteProjects,
        filteredRegulars: regularProjects,
        totalItems: favoriteProjects.length + regularProjects.length,
      }
    }

    const searchLower = searchText.toLowerCase()

    const filter = (item: Project) => {
      return item.name.toLowerCase().includes(searchLower)
        || item.path.toLowerCase().includes(searchLower)
    }

    const filteredFavorites = favoriteProjects.filter(filter)
    const filteredRegulars = regularProjects.filter(filter)

    return {
      filteredFavorites,
      filteredRegulars,
      totalItems: filteredFavorites.length + filteredRegulars.length,
    }
  }, [favoriteProjects, regularProjects, searchText])

  const handleToggleFavorite = async (project: Project) => {
    const res = await toggleFavorite(project)
    const resText = res ? 'Added to Favorites' : 'Removed from Favorites'
    await showSuccessToast(resText, project.name)
  }

  if (!adapter.appStoragePath) {
    return (
      <List
        actions={(
          <ActionPanel>
            <ActionPanel.Section title="Configuration Required">
              <Action
                title="Set Storage Path"
                onAction={openExtensionPreferences}
              />
            </ActionPanel.Section>
          </ActionPanel>
        )}
      >
        <List.EmptyView
          title={`${adapter.appName} Storage Path Not Configured`}
          description={`Please set the ${adapter.appName} storage path in the extension settings.`}
        />
      </List>
    )
  }

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
                      key={item.id}
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
                      key={item.id}
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
