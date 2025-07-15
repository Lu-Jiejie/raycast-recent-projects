import type { Project } from '../types'
import fs from 'node:fs'
import { Action, ActionPanel, Icon, List } from '@raycast/api'
import { execPromise, showSuccessToast, withErrorHandling } from '../logic'

interface ProjectListItemProps {
  project: Project
  openTitle?: string
  onOpenProject: (project: Project) => void
  onToggleFavorite: (project: Project) => void
}

async function handleOpenInExplorer(windosPath: string) {
  if (fs.existsSync(windosPath)) {
    await withErrorHandling(async () => {
      const stat = fs.statSync(windosPath)
      // 确保exec时使用 Windows 路径格式
      windosPath = windosPath.replaceAll(/\//g, '\\')
      if (stat.isDirectory()) {
        await execPromise(`explorer /root,"${windosPath}"`)
      }
      else {
        await execPromise(`explorer /select,"${windosPath}"`)
      }
    }, errorMessage => ({
      title: 'Failed to open in Explorer',
      message: errorMessage,
    }), {
      title: 'Opened in Explorer',
      message: windosPath,
    })
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
              title="Open in Explorer"
              icon={Icon.Folder}
              onAction={() => handleOpenInExplorer(project.path)}
            />
            <Action.CopyToClipboard
              title="Copy Project Path"
              content={project.path}
              onCopy={() => handleCopyPath(project.path)}
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
