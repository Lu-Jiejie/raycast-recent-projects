import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

interface WorkspaceConfigItem {
  name: string
  title: string
  description?: string
  storagePath: {
    placeholder?: string
    description?: string
  }
  exePath: {
    placeholder?: string
    description?: string
  }
}

interface BrowserConfigItem {
  name: string
  title: string
  description?: string
  bookmarkPath: {
    placeholder?: string
    description?: string
  }
  exePath: {
    placeholder?: string
    description?: string
  }
}
// const favoriteConfig = {
//   name: 'favorites',
//   title: 'Favorites',
//   description: 'Manage your favorite projects.',
// }

// function generateFavoritesCommand(favoriteConfig: {
//   name: string
//   title: string
//   description: string
// }) {
//   return {
//     name: favoriteConfig.name,
//     title: favoriteConfig.title,
//     description: favoriteConfig.description,
//     mode: 'view',
//   }
// }

const workspaceConfig: WorkspaceConfigItem[] = [
  {
    name: 'vscode',
    title: 'Visual Studio Code',
    storagePath: {
      description: 'Path to "state.vscdb"',
      placeholder: 'Path to "state.vscdb"',
    },
    exePath: {
      description: 'Path to "code.exe"',
      placeholder: 'Path to "code.exe"',
    },
  },
  {
    name: 'cursor',
    title: 'Cursor',
    storagePath: {
      description: 'Path to "state.vscdb"',
      placeholder: 'Path to "state.vscdb"',
    },
    exePath: {
      description: 'Path to "Cursor.exe"',
      placeholder: 'Path to "Cursor.exe"',
    },
  },
]

function generateWorkspaceCommand(app: WorkspaceConfigItem) {
  return {
    name: app.name,
    title: app.title,
    description: app.description || `Quickly open recent projects in ${app.title}.`,
    mode: 'view',
  }
}

function generateWorkspacePreference(app: WorkspaceConfigItem) {
  return [
    {
      name: `${app.name}StoragePath`,
      title: `${app.title} Storage Path`,
      description: app.storagePath.description || `Path to ${app.title} recent projects storage file.`,
      type: 'textfield',
      default: '',
      required: false,
    },
    {
      name: `${app.name}ExePath`,
      title: `${app.title} Exe Path`,
      description: app.exePath.description || `Path to ${app.title} executable.`,
      type: 'textfield',
      default: '',
      required: false,
    },
  ]
}

const bookmarkConfig: BrowserConfigItem[] = [
  {
    name: 'chrome',
    title: 'Google Chrome',
    bookmarkPath: {
      description: 'Path to "Bookmarks"',
      placeholder: 'Path to "Bookmarks"',
    },
    exePath: {
      description: 'Path to "chrome.exe"',
      placeholder: 'Path to "chrome.exe"',
    },
  },
  {
    name: 'edge',
    title: 'Microsoft Edge',
    bookmarkPath: {
      description: 'Path to "Bookmarks"',
      placeholder: 'Path to "Bookmarks"',
    },
    exePath: {
      description: 'Path to "msedge.exe"',
      placeholder: 'Path to "msedge.exe"',
    },
  },
]

function generateBrowserCommand(browser: BrowserConfigItem) {
  return {
    name: browser.name,
    title: browser.title,
    description: browser.description || `Quickly open bookmarks in ${browser.title}.`,
    mode: 'view',
  }
}

function generateBrowserPreference(browser: BrowserConfigItem) {
  return [
    {
      name: `${browser.name}BookmarkPath`,
      title: `${browser.title} Bookmark Path`,
      description: browser.bookmarkPath.description || `Path to ${browser.title} bookmarks file.`,
      type: 'textfield',
      default: '',
      required: false,
    },
    {
      name: `${browser.name}ExePath`,
      title: `${browser.title} Exe Path`,
      description: browser.exePath.description || `Path to ${browser.title} executable.`,
      type: 'textfield',
      default: '',
      required: false,
    },
  ]
}

function updatePackageJson() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json')

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    // const favoriteCommand = generateFavoritesCommand(favoriteConfig)
    const workspaceCommands = workspaceConfig.map(generateWorkspaceCommand)
    const browserCommands = bookmarkConfig.map(generateBrowserCommand)

    const workspacePreferences = workspaceConfig.flatMap(generateWorkspacePreference)
    const browserPreferences = bookmarkConfig.flatMap(generateBrowserPreference)

    packageJson.commands = [
      ...workspaceCommands,
      ...browserCommands,
    ]

    packageJson.preferences = [
      ...workspacePreferences,
      ...browserPreferences,
    ]

    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

    const commands = [...workspaceCommands, ...browserCommands]
    console.log('✅ Successfully updated package.json')
    console.log(`📦 Generated ${commands.length} commands:`)
    commands.forEach((cmd) => {
      console.log(`   - ${cmd.name}: ${cmd.title}`)
    })
  }
  catch (error) {
    console.error('❌ Error updating package.json:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  updatePackageJson()
}

export { workspaceConfig as appsConfig, generateWorkspaceCommand as generateCommand, updatePackageJson }
