import { APPS_CONFIG } from './appsConfig'
import { AppView } from './components/AppView'

// Find the config for this specific command
const appConfig = APPS_CONFIG.find(app => app.id === 'vscode')

// This command is now just a shell that renders the generic view
export default function VscodeCommand() {
  if (!appConfig) {
    // Handle case where config is not found, though it should not happen
    return null
  }
  return <AppView app={appConfig} />
}
