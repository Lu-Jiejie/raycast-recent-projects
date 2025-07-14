import { appsConfig } from './adapters'
import { AppView } from './components/AppView'

export default function Command() {
  const config = appsConfig.cursor

  return (
    <AppView
      adapter={config.adapter}
      appName={config.name}
      searchBarPlaceholder={config.searchBarPlaceholder}
      openTitle={config.openTitle}
      openIcon={config.openIcon}
    />
  )
}
