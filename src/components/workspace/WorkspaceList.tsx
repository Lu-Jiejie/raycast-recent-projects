import type { Adapter, Project } from '../../types'
import { Action, ActionPanel, List, openExtensionPreferences } from '@raycast/api'
import { useEffect } from 'react'
import { showErrorToast, showSuccessToast } from '../../logic'
import { useProjectList } from '../../logic/useProjectList'
import { WorkspaceListItem } from './WorkspaceListItem'

interface WorkspaceListProps {
  adapter: Adapter
  searchBarPlaceholder?: string
}

export function WorkspaceList({
  adapter,
  searchBarPlaceholder,
}: WorkspaceListProps) {
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
      searchBarPlaceholder={searchBarPlaceholder || `Search recent projects for ${adapter.appName}...`}
      throttle={true}
    >
      {favoriteProjects.length === 0 && regularProjects.length === 0 && !isLoading
        ? (
            <List.EmptyView
              title="No projects found"
              description="No recent projects"
            />
          )
        : (
            <>
              {favoriteProjects.length > 0 && (
                <List.Section title="Favorites" subtitle={`${favoriteProjects.length} projects`}>
                  {favoriteProjects.map(item => (
                    <WorkspaceListItem
                      key={item.id}
                      project={item}
                      onToggleFavorite={handleToggleFavorite}
                      keywords={[item.name, item.path]}
                    />
                  ))}
                </List.Section>
              )}

              {regularProjects.length > 0 && (
                <List.Section title="Recent Projects" subtitle={`${regularProjects.length} projects`}>
                  {regularProjects.map(item => (
                    <WorkspaceListItem
                      key={item.id}
                      project={item}
                      onToggleFavorite={handleToggleFavorite}
                      keywords={[item.name, item.path]}
                    />
                  ))}
                </List.Section>
              )}
            </>
          )}
    </List>
  )
}
