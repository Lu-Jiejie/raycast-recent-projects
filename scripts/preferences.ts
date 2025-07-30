/* eslint-disable unused-imports/no-unused-vars */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

interface AppConfig {
  name: string
  title: string
  description?: string
  storagePath: {
    placeholder: string
    description?: string
  }
  exePath: {
    placeholder: string
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

const appsConfig: AppConfig[] = [
  {
    name: 'vscode',
    title: 'Visual Studio Code',
    storagePath: {
      placeholder: 'C:/Users/USER_NAME/AppData/Roaming/Code/User/globalStorage/storage.json',
      description: 'Path to Visual Studio Code recent projects storage file.',
    },
    exePath: {
      placeholder: 'C:/Program Files/Microsoft VS Code/code.exe',
      description: 'Path to Visual Studio Code executable.',
    },
  },
  {
    name: 'cursor',
    title: 'Cursor',
    storagePath: {
      placeholder: 'C:/Users/USER_NAME/AppData/Roaming/Cursor/User/globalStorage/storage.json',
      description: 'Path to Cursor recent projects storage file.',
    },
    exePath: {
      placeholder: 'C:/Users/USER_NAME/Local/Programs/cursor/Cursor.exe',
      description: 'Path to Cursor executable.',
    },
  },
]

function generateAppCommand(app: AppConfig) {
  return {
    name: app.name,
    title: app.title,
    description: app.description || `Quickly open recent projects in ${app.title}.`,
    mode: 'view',
    preferences: [
      {
        name: `${app.name}StoragePath`,
        title: `${app.title} Storage Path`,
        description: app.storagePath.description || `Path to ${app.title} recent projects storage file.`,
        type: 'file',
        default: '',
        placeholder: app.storagePath.placeholder,
        required: true,
      },
      {
        name: `${app.name}ExePath`,
        title: `${app.title} Executable Path`,
        description: app.exePath.description || `Path to ${app.title} executable.`,
        type: 'file',
        default: '',
        placeholder: app.exePath.placeholder,
        required: true,
      },
    ],
  }
}

interface BrowserConfig {
  name: string
  title: string
  description?: string
  bookmarkPath: string
}

function generateBookmarkCommand(browser: BrowserConfig) {
  return {

  }
}

function updatePackageJson() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json')

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    // const favoriteCommand = generateFavoritesCommand(favoriteConfig)
    const appCommands = appsConfig.map(generateAppCommand)

    packageJson.commands = [
      // favoriteCommand,
      ...appCommands,
    ]

    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

    console.log('✅ Successfully updated package.json')
    console.log(`📦 Generated ${appCommands.length} commands:`)
    appCommands.forEach((cmd) => {
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

export { appsConfig, generateAppCommand as generateCommand, updatePackageJson }
