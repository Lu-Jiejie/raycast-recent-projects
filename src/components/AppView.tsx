import type { Adapter } from '../adapters'
import type { Project } from '../types'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { useMemo, useState } from 'react'
import { useApp } from '../logic/useApp'

interface AppViewProps {
  adapter: Adapter
  searchBarPlaceholder: string
  openTitle: string
  openIcon: string
}

function openInExplorer(targetPath: string) {
  if (fs.existsSync(targetPath)) {
    const stat = fs.statSync(targetPath)
    if (stat.isDirectory()) {
      exec(`explorer "${targetPath}"`)
    }
    else {
      exec(`explorer /select,"${targetPath}"`)
    }
  }
}

export function AppView({
  adapter,
  searchBarPlaceholder,
  openTitle,
  openIcon,
}: AppViewProps) {
  const [searchText, setSearchText] = useState('')

  const {
    favoriteProjects,
    regularProjects,
    isLoading,
    handleCopyPath,
    handleOpenProject,
    handleToggleFavorite,
  } = useApp(adapter)

  // 过滤项目（在已分组的数据基础上）
  const { filteredFavorites, filteredRegulars } = useMemo(() => {
    if (!searchText) {
      return {
        filteredFavorites: favoriteProjects,
        filteredRegulars: regularProjects,
      }
    }

    const searchLower = searchText.toLowerCase()
    const filter = (item: Project) =>
      item.name.toLowerCase().includes(searchLower)
      || item.path.toLowerCase().includes(searchLower)

    return {
      filteredFavorites: favoriteProjects.filter(filter),
      filteredRegulars: regularProjects.filter(filter),
    }
  }, [favoriteProjects, regularProjects, searchText])

  const totalItems = filteredFavorites.length + filteredRegulars.length

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={searchBarPlaceholder}
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
                  {filteredFavorites.map((item: Project) => (
                    <List.Item
                      key={item.path}
                      icon={item.icon || Icon.Document}
                      title={item.name}
                      subtitle={item.path}
                      accessories={[{ icon: Icon.Star, tooltip: 'Favorite' }]}
                      actions={(
                        <ActionPanel>
                          <ActionPanel.Section title="Project Actions">
                            <Action
                              title={openTitle}
                              icon={openIcon}
                              onAction={() => handleOpenProject(item)}
                            />
                            <Action
                              title="Remove from Favorites"
                              icon={Icon.StarDisabled}
                              onAction={() => handleToggleFavorite(item)}
                            />
                            <Action
                              title="Open in Explorer"
                              icon={Icon.Folder}
                              onAction={() => openInExplorer(item.path)}
                            />
                            <Action.CopyToClipboard
                              title="Copy Project Path"
                              content={item.path}
                              onCopy={() => handleCopyPath(item)}
                            />
                          </ActionPanel.Section>
                        </ActionPanel>
                      )}
                    />
                  ))}
                </List.Section>
              )}

              {filteredRegulars.length > 0 && (
                <List.Section title="Recent Projects" subtitle={`${filteredRegulars.length} projects`}>
                  {filteredRegulars.map((item: Project) => (
                    <List.Item
                      key={item.path}
                      icon={item.icon || Icon.Document}
                      title={item.name}
                      subtitle={item.path}
                      actions={(
                        <ActionPanel>
                          <ActionPanel.Section title="Project Actions">
                            <Action
                              title={openTitle}
                              icon={openIcon}
                              onAction={() => handleOpenProject(item)}
                            />
                            <Action
                              title="Add to Favorites"
                              icon={Icon.Star}
                              onAction={() => handleToggleFavorite(item)}
                            />
                            <Action
                              title="Open in Explorer"
                              icon={Icon.Folder}
                              onAction={() => openInExplorer(item.path)}
                            />
                            <Action.CopyToClipboard
                              title="Copy Project Path"
                              content={item.path}
                              onCopy={() => handleCopyPath(item)}
                            />
                          </ActionPanel.Section>
                        </ActionPanel>
                      )}
                    />
                  ))}
                </List.Section>
              )}
            </>
          )}
    </List>
  )
}
