import { adapterMap } from '../../adapters'
import { ProjectList } from '../workspace/WorkspaceList'

export function createWorkspaceListView(appKey: keyof typeof adapterMap.workspace) {
  return function WorkspaceListView() {
    const adapter = adapterMap.workspace[appKey]

    return (
      <ProjectList
        adapter={adapter}
        searchBarPlaceholder={adapter.searchBarPlaceholder}
      />
    )
  }
}
