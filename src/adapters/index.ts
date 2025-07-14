import type { Adapter } from '../types'
import { cursorAdapter } from './cursor'
import { vscodeAdapter } from './vscode'

export interface AppConfig {
  name: string
  adapter: Adapter
  searchBarPlaceholder: string
  openTitle: string
  openIcon: string
}

export const appsConfig: Record<string, AppConfig> = {
  vscode: {
    name: 'VSCode',
    adapter: vscodeAdapter,
    searchBarPlaceholder: 'Search recent projects for Visual Studio Code...',
    openTitle: 'Open in VSCode',
    openIcon: 'icons/vscode.png',
  },
  cursor: {
    name: 'Cursor',
    adapter: cursorAdapter,
    searchBarPlaceholder: 'Search recent projects for Cursor...',
    openTitle: 'Open in Cursor',
    openIcon: 'icons/cursor.png',
  },
}
