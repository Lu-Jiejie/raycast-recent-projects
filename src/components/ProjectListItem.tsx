import type { Project } from '../types'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { showSuccessToast } from '../logic'

interface ProjectListItemProps {
  project: Project
  openTitle?: string
  onOpenProject: (project: Project) => void
  onToggleFavorite: (project: Project) => void
}

function handleOpenInExplorer(targetPath: string) {
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

async function handleCopyPath(path: string) {
  await showSuccessToast('Copied Project Path', path)
}

export function ProjectListItem({
  project,
  openTitle = `Open in ${project.appName}`,
  onOpenProject,
  onToggleFavorite,
}: ProjectListItemProps) {
  return (
    <List.Item
      key={project.path}
      icon={project.icon || Icon.Document}
      title={project.name}
      subtitle={project.path}
      accessories={project.isFavorite ? [{ icon: Icon.Star, tooltip: 'Favorite' }] : undefined}
      actions={(
        <ActionPanel>
          <ActionPanel.Section title="Project Actions">
            <Action
              title={openTitle}
              icon={project.icon}
              onAction={() => onOpenProject(project)}
            />
            <Action
              title={project.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              icon={project.isFavorite ? Icon.StarDisabled : Icon.Star}
              onAction={() => onToggleFavorite(project)}
            />
            <Action
              title="Open in Explorer"
              icon={Icon.Folder}
              onAction={() => handleOpenInExplorer(project.path)}
            />
            <Action.CopyToClipboard
              title="Copy Project Path"
              content={project.path}
              onCopy={() => handleCopyPath(project.path)}
            />
          </ActionPanel.Section>
        </ActionPanel>
      )}
    />
  )
}
