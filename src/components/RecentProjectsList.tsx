import type { Project } from '../types'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { useMemo, useState } from 'react'

interface RecentProjectsListProps {
  projects: Project[]
  isLoading: boolean
  onOpen: (item: Project) => void
  onCopy: (item: Project) => void
  onToggleFavorite?: (item: Project) => void
  searchBarPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  sectionTitle?: string
  openTitle?: string
  openIcon?: string
  copyTitle?: string
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

export function RecentProjectsList({
  projects,
  isLoading,
  onOpen,
  onCopy,
  onToggleFavorite,
  searchBarPlaceholder = 'Search recent projects...',
  emptyTitle = 'No projects found',
  emptyDescription = 'No recent projects or no matches',
  sectionTitle = 'Project Actions',
  openTitle = 'Open in App',
  openIcon = Icon.Code,
  copyTitle = 'Copy Project Path',
}: RecentProjectsListProps) {
  const [searchText, setSearchText] = useState('')

  const filteredItems = useMemo(() => {
    if (!searchText)
      return projects
    const searchLower = searchText.toLowerCase()
    return projects.filter((item: Project) =>
      item.name.toLowerCase().includes(searchLower)
      || item.path.toLowerCase().includes(searchLower),
    )
  }, [projects, searchText])

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={searchBarPlaceholder}
      throttle={true}
    >
      {filteredItems.length === 0 && !isLoading
        ? (
            <List.EmptyView
              icon={Icon.MagnifyingGlass}
              title={emptyTitle}
              description={emptyDescription}
            />
          )
        : (
            filteredItems.map((item: Project) => (
              <List.Item
                key={item.path}
                icon={item.icon || Icon.Document}
                title={item.name}
                subtitle={item.path}
                actions={(
                  <ActionPanel>
                    <ActionPanel.Section title={sectionTitle}>
                      <Action
                        title={openTitle}
                        icon={openIcon}
                        onAction={() => onOpen(item)}
                      />
                      {onToggleFavorite && (
                        <Action
                          title={item.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                          icon={item.isFavorite ? Icon.StarDisabled : Icon.Star}
                          onAction={() => onToggleFavorite(item)}
                        />
                      )}
                      <Action
                        title="Open in Explorer"
                        icon={Icon.Folder}
                        onAction={() => openInExplorer(item.path)}
                      />
                      <Action.CopyToClipboard
                        title={copyTitle}
                        content={item.path}
                        onCopy={() => onCopy(item)}
                      />
                    </ActionPanel.Section>
                  </ActionPanel>
                )}
              />
            ))
          )}
    </List>
  )
}
