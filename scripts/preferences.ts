import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

// 应用配置接口
interface AppConfig {
  name: string // command 名称，如 'vscode'
  title: string // 显示标题，如 'Visual Studio Code'
  description?: string // 描述，可选，默认根据 title 生成
  storagePath: {
    placeholder: string // storage 文件路径示例
    description?: string // 自定义描述，可选
  }
  exePath: {
    placeholder: string // 可执行文件路径示例
    description?: string // 自定义描述，可选
  }
}

// 配置你要支持的应用
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
  // 添加更多应用配置
  // {
  //   name: 'webstorm',
  //   title: 'WebStorm',
  //   description: 'Quickly open recent projects in WebStorm.',
  //   storagePath: {
  //     placeholder: 'C:/Users/USER_NAME/AppData/Roaming/JetBrains/WebStorm2023.1/options/recentProjects.xml',
  //   },
  //   exePath: {
  //     placeholder: 'C:/Program Files/JetBrains/WebStorm 2023.1/bin/webstorm64.exe',
  //   },
  // },
]

// 生成单个 command 配置
function generateCommand(app: AppConfig) {
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
        type: 'textfield',
        default: '',
        placeholder: app.storagePath.placeholder,
        required: true,
      },
      {
        name: `${app.name}ExePath`,
        title: `${app.title} Executable Path`,
        description: app.exePath.description || `Path to ${app.title} executable.`,
        type: 'textfield',
        default: '',
        placeholder: app.exePath.placeholder,
        required: true,
      },
    ],
  }
}

// 更新 package.json
function updatePackageJson() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json')

  try {
    // 读取当前 package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    // 生成新的 commands 配置
    const newCommands = appsConfig.map(generateCommand)

    // 更新 commands
    packageJson.commands = newCommands

    // 写回文件，格式化 JSON
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

    console.log('✅ Successfully updated package.json')
    console.log(`📦 Generated ${newCommands.length} commands:`)
    newCommands.forEach((cmd) => {
      console.log(`   - ${cmd.name}: ${cmd.title}`)
    })
  }
  catch (error) {
    console.error('❌ Error updating package.json:', error)
    process.exit(1)
  }
}

// 运行脚本
if (require.main === module) {
  updatePackageJson()
}

export { appsConfig, generateCommand, updatePackageJson }
