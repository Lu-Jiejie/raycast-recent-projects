import type { Project } from '../../types'
import { Action, ActionPanel, Color, Icon, List } from '@raycast/api'
import { getBranchColor, showSuccessToast } from '../../logic'

interface WorkspaceListItemProps {
  project: Project
  onToggleFavorite: (project: Project) => void
  onToggleHidden?: (project: Project) => void
  keywords?: string[]
  branch?: string
}

async function handleCopyPath(path: string) {
  await showSuccessToast('Copied Project Path', path)
}

export function WorkspaceListItem({
  project,
  onToggleFavorite,
  onToggleHidden,
  keywords,
  branch,
}: WorkspaceListItemProps) {
  const accessories: List.Item.Accessory[] = []

  if (branch) {
    accessories.push({
      tag: { value: branch, color: getBranchColor(branch) },
      tooltip: `Branch: ${branch}`,
    })
  }

  if (project.isFavorite) {
    accessories.push({
      icon: { source: Icon.Star, tintColor: Color.Yellow },
      tooltip: 'Favorite',
    })
  }

  if (project.isHidden) {
    accessories.push({
      icon: { source: Icon.EyeDisabled, tintColor: Color.SecondaryText },
      tooltip: 'Hidden',
    })
  }

  return (
    <List.Item
      key={project.id}
      icon={project.icon || Icon.Document}
      title={project.name}
      subtitle={project.path}
      keywords={keywords}
      accessories={accessories.length > 0 ? accessories : undefined}
      actions={(
        <ActionPanel>
          <ActionPanel.Section title="Project Actions">
            <Action.Open
              title={`Open in ${project.appName}`}
              icon={project.icon}
              target={project.path}
              application={
                project.appExePath
                  ? {
                      name: project.appName,
                      path: project.appExePath,
                    }
                  : project.appName
              }
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
                Windows: { modifiers: ['ctrl'], key: 'c' },
                macOS: { modifiers: ['cmd'], key: 'c' },
              }}
            />
            <Action
              title={project.isHidden ? 'Unhide' : 'Hide'}
              icon={project.isHidden ? Icon.Eye : Icon.EyeDisabled}
              onAction={() => onToggleHidden?.(project)}
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
