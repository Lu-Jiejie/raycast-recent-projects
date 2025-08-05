import type { Image } from '@raycast/api'
import type { Project } from '../../types'
import { Action, ActionPanel, Color, Icon, List } from '@raycast/api'
import { showSuccessToast } from '../../logic'

interface BookmarkListItemProps {
  project: Project
  icon?: Image.ImageLike
  onToggleFavorite: (project: Project) => void
}

async function handleCopyPath(path: string) {
  await showSuccessToast('Copied Bookmark URL', path)
}

export function BookmarkListItem({
  project,
  icon = '',
  onToggleFavorite,
}: BookmarkListItemProps) {
  return (
    <List.Item
      key={project.id}
      icon={icon}
      title={project.name}
      subtitle={project.path}
      accessories={[
        ...(project.tags ? project.tags.map(tag => ({ tag })) : []),
        ...(project.isFavorite
          ? [{ icon: { source: Icon.Star, tintColor: Color.Yellow }, tooltip: 'Favorite' }]
          : []),
      ]}
      actions={(
        <ActionPanel>
          <ActionPanel.Section title="Bookmark Actions">
            <Action.OpenInBrowser url={project.path} />
            <Action.CopyToClipboard
              title="Copy Bookmark URL"
              content={project.path}
              onCopy={() => handleCopyPath(project.path)}
              shortcut={{
                windows: { modifiers: ['ctrl'], key: 'c' },
                macOS: { modifiers: ['cmd'], key: 'c' },
              }}
            />
            <Action
              title={project.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              icon={project.isFavorite ? Icon.StarDisabled : Icon.Star}
              onAction={() => onToggleFavorite(project)}
            />
          </ActionPanel.Section>
        </ActionPanel>
      )}
    />
  )
}
