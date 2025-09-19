import { AppView } from './components/AppView'
import { appsConfig } from './registry'

const appConfig = appsConfig.find(app => app.id === 'edge')

export default function EdgeCommand() {
  if (!appConfig)
    return null
  return <AppView app={appConfig} />
}
