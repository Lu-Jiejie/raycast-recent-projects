import { appsConfig } from '../../adapters'
import { ProjectList } from '../ProjectList'

export function createProjectListView(appKey: keyof typeof appsConfig) {
  return function ProjectListView() {
    const config = appsConfig[appKey]

    return (
      <ProjectList
        adapter={config.adapter}
        searchBarPlaceholder={config.searchBarPlaceholder}
      />
    )
  }
}
