import { APPS_CONFIG } from './appsConfig'
import { AppView } from './components/AppView'

const appConfig = APPS_CONFIG.find(app => app.id === 'chrome')

export default function ChromeCommand() {
  if (!appConfig)
    return null
  return <AppView app={appConfig} />
}
