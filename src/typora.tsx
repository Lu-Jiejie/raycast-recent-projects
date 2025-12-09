import { AppView } from './components/AppView'
import { appsConfig } from './registry'

const appConfig = appsConfig.find(app => app.id === 'typora')

export default function TyporaCommand() {
  if (!appConfig) {
    return null
  }
  return <AppView app={appConfig} />
}
