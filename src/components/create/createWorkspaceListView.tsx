import { appsConfig } from '../../adapters'
import { ProjectList } from '../workspace/WorkspaceList'

export function createWorkspaceListView(appKey: keyof typeof appsConfig) {
  return function WorkspaceListView() {
    const config = appsConfig[appKey]

    return (
      <ProjectList
        adapter={config.adapter}
        searchBarPlaceholder={config.searchBarPlaceholder}
      />
    )
  }
}
