import { adapterMap } from '../../adapters'
import { ProjectList } from '../workspace/WorkspaceList'

export function createWorkspaceListView(appKey: keyof typeof adapterMap) {
  return function WorkspaceListView() {
    const adapter = adapterMap[appKey]

    return (
      <ProjectList
        adapter={adapter}
        searchBarPlaceholder={adapter.searchBarPlaceholder}
      />
    )
  }
}
