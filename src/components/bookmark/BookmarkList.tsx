import type { Adapter } from '../../adapters'
import type { Project } from '../../types'
import { Action, ActionPanel, List, openExtensionPreferences } from '@raycast/api'
import { useEffect, useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast } from '../../logic'
import { useFavicons } from '../../logic/useFavicons'
import { useProjectList } from '../../logic/useProjectList'
import { BookmarkListItem } from './BookmarkListItem'

interface BookmarkListProps {
  adapter: Adapter
  searchBarPlaceholder?: string
}

export function BookmarkList({
  adapter,
  searchBarPlaceholder,
}: BookmarkListProps) {
  const [searchText, setSearchText] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const {
    favoriteProjects,
    regularProjects,
    isLoading,
    toggleFavorite,
    error,
  } = useProjectList(adapter, 'bookmark')

  useEffect(() => {
    if (error) {
      showErrorToast(
        error.title,
        error.message,
      )
    }
  }, [error])

  const allTags = useMemo(() => {
    const pathMap = new Map<string, number>()

    for (const item of [...favoriteProjects, ...regularProjects]) {
      if (item.tags && item.tags.length > 0) {
        const reversedTags = [...item.tags].reverse()
        const fullPath = reversedTags.join(' / ')

        pathMap.set(fullPath, (pathMap.get(fullPath) || 0) + 1)
      }
    }

    return Array.from(pathMap.keys()).sort()
  }, [favoriteProjects, regularProjects])

  const { filteredFavorites, filteredRegulars, totalItems } = useMemo(() => {
    let favs = favoriteProjects
    let regs = regularProjects

    // Apply text search filter
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase()

      const filter = (item: Project) => {
        return item.name.toLowerCase().includes(searchLower)
          || item.path.toLowerCase().includes(searchLower)
      }

      favs = favs.filter(filter)
      regs = regs.filter(filter)
    }

    // Apply tag filter
    if (selectedTag) {
      const filterByTag = (item: Project) => {
        if (!item.tags || item.tags.length === 0)
          return false

        const reversedTags = [...item.tags].reverse()
        const fullPath = reversedTags.join(' / ')

        return fullPath === selectedTag
      }

      favs = favs.filter(filterByTag)
      regs = regs.filter(filterByTag)
    }

    return {
      filteredFavorites: favs,
      filteredRegulars: regs,
      totalItems: favs.length + regs.length,
    }
  }, [favoriteProjects, regularProjects, searchText, selectedTag])

  const visibleBookmarks = useMemo(() => {
    return [...filteredFavorites, ...filteredRegulars]
  }, [filteredFavorites, filteredRegulars])

  const { favicons, isLoading: isFaviconsLoading } = useFavicons(visibleBookmarks)

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
      isLoading={isLoading || isFaviconsLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={searchBarPlaceholder || `Search bookmarks for ${adapter.appName}...`}
      throttle={true}
      searchBarAccessory={
        allTags.length > 0
          ? (
              <List.Dropdown
                tooltip="Filter by Folder Path"
                storeValue
                onChange={setSelectedTag}
              >
                <List.Dropdown.Item title="All" value="" />
                {allTags.map(tagPath => (
                  <List.Dropdown.Item
                    key={tagPath}
                    title={tagPath}
                    value={tagPath}
                  />
                ))}
              </List.Dropdown>
            )
          : undefined
      }
    >
      {totalItems === 0 && !isLoading
        ? (
            <List.EmptyView
              title="No bookmarks found"
              description="No bookmarks or no matches"
            />
          )
        : (
            <>
              {filteredFavorites.length > 0 && (
                <List.Section title="Favorites" subtitle={`${filteredFavorites.length} bookmarks`}>
                  {filteredFavorites.map(item => (
                    <BookmarkListItem
                      key={item.id}
                      project={item}
                      icon={favicons[item.id] || ''}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </List.Section>
              )}

              {filteredRegulars.length > 0 && (
                <List.Section title="Recent Bookmarks" subtitle={`${filteredRegulars.length} bookmarks`}>
                  {filteredRegulars.map(item => (
                    <BookmarkListItem
                      key={item.id}
                      project={item}
                      icon={favicons[item.id] || ''}
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
