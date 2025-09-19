import { AppView } from './components/AppView'
import { appsConfig } from './registry'

const appConfig = appsConfig.find(app => app.id === 'cursor')

export default function CursorCommand() {
  if (!appConfig)
    return null
  return <AppView app={appConfig} />
}
