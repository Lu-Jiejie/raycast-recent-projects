import type { Project } from '../types'
import { Action, ActionPanel, Color, Icon, List } from '@raycast/api'
import { showSuccessToast, toWindowsPath } from '../logic'

interface ProjectListItemProps {
  project: Project
  onToggleFavorite: (project: Project) => void
}

async function handleCopyPath(path: string) {
  await showSuccessToast('Copied Project Path', path)
}

export function ProjectListItem({
  project,
  onToggleFavorite,
}: ProjectListItemProps) {
  return (
    <List.Item
      key={project.id}
      icon={project.appIcon || Icon.Document}
      title={project.name}
      subtitle={project.path}
      accessories={project.isFavorite
        ? [{ icon: { source: Icon.Star, tintColor: Color.Yellow }, tooltip: 'Favorite' }]
        : undefined}
      actions={(
        <ActionPanel>
          <ActionPanel.Section title="Project Actions">
            <Action.Open
              title={`Open in ${project.appName}`}
              icon={project.appIcon}
              target={project.path}
              application={{
                name: project.appName,
                path: toWindowsPath(project.appExePath),
              }}
            />
            <Action.ShowInFinder
              title="Show in Explorer"
              icon={Icon.Folder}
              path={project.path}
            />
            <Action.CopyToClipboard
              title="Copy Project Path"
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
