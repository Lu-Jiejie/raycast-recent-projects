import { appsConfig } from '../../adapters'
import { AppView } from '../AppView'

export function createAppCommand(appKey: keyof typeof appsConfig) {
  return function AppCommand() {
    const config = appsConfig[appKey]

    return (
      <AppView
        adapter={config.adapter}
        searchBarPlaceholder={config.searchBarPlaceholder}
        openTitle={config.openTitle}
        openIcon={config.adapter.icon}
      />
    )
  }
}
