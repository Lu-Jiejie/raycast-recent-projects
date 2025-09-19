import { AppView } from './components/AppView'
import { appsConfig } from './registry'

const appConfig = appsConfig.find(app => app.id === 'vscode')

export default function VscodeCommand() {
  if (!appConfig) {
    return null
  }
  return <AppView app={appConfig} />
}
