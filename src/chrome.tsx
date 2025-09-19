import { AppView } from './components/AppView'
import { appsConfig } from './registry'

const appConfig = appsConfig.find(app => app.id === 'chrome')

export default function ChromeCommand() {
  if (!appConfig)
    return null
  return <AppView app={appConfig} />
}
