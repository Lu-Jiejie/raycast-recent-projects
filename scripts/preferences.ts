import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
// Import from the single, safe config file
import { APPS_CONFIG } from '../src/appsConfig'

const defaultPreferences = [
  {
    name: 'hideNotExistItems',
    title: 'Hide Not Exist Items',
    description: 'Hide items whose paths do not exist',
    type: 'checkbox',
    label: 'Hide Not Exist Items',
    default: false,
    required: false,
  },
]

function updatePackageJson() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json')

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    // Generate commands from the pure metadata
    const generatedCommands = APPS_CONFIG.map((app) => {
      const title = app.type === 'workspace'
        ? `${app.name} (Recent Projects)`
        : `${app.name} (Bookmarks)`
      return {
        name: app.id,
        title,
        description: `Quickly open ${app.type === 'workspace' ? 'recent projects' : 'bookmarks'} in ${app.name}.`,
        mode: 'view',
      }
    })

    // Generate preferences from the pure metadata
    const generatedPreferences = APPS_CONFIG.flatMap((app) => {
      const storagePathTitle = app.type === 'workspace' ? 'Storage Path' : 'Bookmark Path'

      return [
        {
          name: `${app.id}StoragePath`, // Use the corrected name
          title: `${app.name} [${storagePathTitle}]`,
          description: app.storagePathDesc,
          type: 'textfield',
          default: '',
          required: false,
        },
        {
          name: `${app.id}ExePath`,
          title: `${app.name} [Exe Path]`,
          description: app.exePathDesc,
          type: 'textfield',
          default: '',
          required: false,
        },
      ]
    })

    packageJson.commands = [
      {
        name: 'index',
        title: 'Show All Recent Projects',
        description: 'Shows recent projects from all configured applications.',
        mode: 'view',
      },
      ...generatedCommands,
    ]

    packageJson.preferences = [
      ...defaultPreferences,
      ...generatedPreferences,
    ]

    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}
`)

    console.log('✅ Successfully updated package.json')
    console.log(`📦 Generated ${generatedCommands.length + 1} commands:`)
    packageJson.commands.forEach((cmd: { name: string, title: string }) => {
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
