import type { Adapter, Project } from '../../types'
import { Action, ActionPanel, List, openExtensionPreferences } from '@raycast/api'
import { useEffect, useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast } from '../../logic'
import { useGitBranches } from '../../logic/useGitBranches'
import { useProjectList } from '../../logic/useProjectList'
import { WorkspaceListItem } from './WorkspaceListItem'

interface WorkspaceListProps {
  adapter: Adapter
  searchBarPlaceholder?: string
}

type Visibility = 'visible' | 'hidden' | 'all'

export function WorkspaceList({
  adapter,
  searchBarPlaceholder,
}: WorkspaceListProps) {
  const [visibility, setVisibility] = useState<Visibility>('visible')

  const {
    favoriteProjects,
    regularProjects,
    hiddenProjects,
    isLoading,
    toggleFavorite,
    toggleHidden,
    isHidden,
    error,
  } = useProjectList(adapter)

  const allProjects = useMemo(
    () => [...favoriteProjects, ...regularProjects, ...hiddenProjects],
    [favoriteProjects, regularProjects, hiddenProjects],
  )

  const branchMap = useGitBranches(allProjects)

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

  const handleToggleHidden = async (project: Project) => {
    const res = await toggleHidden(project)
    const resText = res ? 'Hidden' : 'Unhidden'
    await showSuccessToast(resText, project.name)
  }

  const visibleFavorites = useMemo(
    () => visibility === 'all' || visibility === 'visible'
      ? favoriteProjects
      : favoriteProjects.filter(p => isHidden(p)),
    [favoriteProjects, visibility, isHidden],
  )

  const visibleRegulars = useMemo(
    () => visibility === 'all' || visibility === 'visible'
      ? regularProjects
      : regularProjects.filter(p => isHidden(p)),
    [regularProjects, visibility, isHidden],
  )

  const visibleHidden = useMemo(
    () => visibility === 'all' || visibility === 'hidden'
      ? hiddenProjects
      : [],
    [hiddenProjects, visibility],
  )

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
      searchBarAccessory={(
        <List.Dropdown
          tooltip="Visibility"
          value={visibility}
          onChange={v => setVisibility(v as Visibility)}
        >
          <List.Dropdown.Item title="Visible" value="visible" />
          <List.Dropdown.Item title="Hidden" value="hidden" />
          <List.Dropdown.Item title="All" value="all" />
        </List.Dropdown>
      )}
    >
      {visibleFavorites.length === 0 && visibleRegulars.length === 0 && visibleHidden.length === 0 && !isLoading
        ? (
            <List.EmptyView
              title="No projects found"
              description="No recent projects"
            />
          )
        : (
            <>
              {visibleFavorites.length > 0 && (
                <List.Section title="Favorites" subtitle={`${visibleFavorites.length} projects`}>
                  {visibleFavorites.map(item => (
                    <WorkspaceListItem
                      key={item.id}
                      project={item}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleHidden={handleToggleHidden}
                      keywords={[item.name, item.path]}
                      branch={branchMap[item.id]}
                    />
                  ))}
                </List.Section>
              )}

              {visibleRegulars.length > 0 && (
                <List.Section title="Recent Projects" subtitle={`${visibleRegulars.length} projects`}>
                  {visibleRegulars.map(item => (
                    <WorkspaceListItem
                      key={item.id}
                      project={item}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleHidden={handleToggleHidden}
                      keywords={[item.name, item.path]}
                      branch={branchMap[item.id]}
                    />
                  ))}
                </List.Section>
              )}

              {visibleHidden.length > 0 && (
                <List.Section title="Hidden" subtitle={`${visibleHidden.length} projects`}>
                  {visibleHidden.map(item => (
                    <WorkspaceListItem
                      key={item.id}
                      project={item}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleHidden={handleToggleHidden}
                      keywords={[item.name, item.path]}
                      branch={branchMap[item.id]}
                    />
                  ))}
                </List.Section>
              )}
            </>
          )}
    </List>
  )
}
