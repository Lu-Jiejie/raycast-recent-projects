import { exec } from 'node:child_process'
import { Color, showToast, Toast } from '@raycast/api'

export function execPromise(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        reject(error)
      }
      else {
        resolve()
      }
    })
  })
}

export function showSuccessToast(title: string, message: string) {
  return showToast({
    style: Toast.Style.Success,
    title,
    message,
  })
}

export function showErrorToast(title: string, message: string) {
  return showToast({
    style: Toast.Style.Failure,
    title,
    message,
  })
}

type Result<T> = { ok: true, data: T } | { ok: false, error: string }
export async function withErrorHandling<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn()
    return { ok: true, data }
  }
  catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export function toWindowsPath(path: string): string {
  return path.replace(/\//g, '\\')
}

export function toUnixPath(path: string): string {
  return path.replace(/\\/g, '/')
}

/*
 * 常见分支内置颜色映射。
 * 每个规则：[分支模式数组, Raycast 内置颜色]
 * 模式支持 * 通配符（如 "feat/*" 匹配 feat/xxx）
 * 匹配从上到下，命中第一个即返回。
 * 要新增：在 BRANCH_COLORS 末尾加一行即可。
 */
type BranchColorRule = [patterns: string[], color: string]

const BRANCH_COLORS: BranchColorRule[] = [
  // 🌟 核心分支 (高稳定度/生产环境)
  [['main', 'master', 'production', 'prod'], Color.Green],
  [['develop', 'dev'], Color.Blue],

  // 🚀 业务变更与发布
  [['feat/*', 'feature/*'], Color.Purple],
  [['release/*', 'rc/*', 'uat/*', 'stg/*', 'staging/*'], Color.Magenta],

  // 🚑 修复类分支 (高警示度)
  [['fix/*', 'bugfix/*', 'hotfix/*'], Color.Red],

  // 🛠️ 代码质量改善 (移入 Blue)
  [['refactor/*'], Color.Blue],
  [['perf/*'], Color.Blue],
  [['style/*'], Color.Blue],

  // 📝 文档与测试
  [['docs/*'], Color.Blue],
  [['test/*'], Color.Yellow],

  // 🤖 工程与依赖 (运维/基础设施变动)
  [['chore/*', 'ci/*', 'build/*'], Color.Yellow],
  [['deps/*', 'dependency/*', 'renovate/*'], Color.Yellow],

  // 🧪 实验与草稿 (低调的灰色)
  [['poc/*', 'exp/*', 'experimental/*'], Color.SecondaryText],
  [['draft/*', 'wip/*'], Color.SecondaryText],
]

function matchBranchPattern(branch: string, pattern: string): boolean {
  if (!pattern.includes('*'))
    return branch === pattern
  const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`)
  return regex.test(branch)
}

export function getBranchColor(branch: string): string {
  for (const [patterns, color] of BRANCH_COLORS) {
    if (patterns.some(p => matchBranchPattern(branch, p)))
      return color
  }
  return getColorForStr(branch)
}

export function getColorForStr(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  /*
   *  调色参数，只改这 4 个数字：
   *
   *       当前值    合法范围    效果
   *  S ———————————————————————————————————
   *  饱和度下限    60    0~100    当前范围 [60, 80)。越大颜色越鲜艳
   *  饱和度浮动    20    0~100    当前波动 ±20。越小颜色越统一
   *
   *  亮度下限      40    0~100    当前范围 [40, 60)。越大背景越亮
   *  亮度浮动      20    0~100    当前波动 ±20。越小亮度越统一
   *
   *  约束：下限 ≥ 0，下限 + 浮动 ≤ 100
   */
  const S_MIN = 60
  const S_RANGE = 20
  const L_MIN = 40
  const L_RANGE = 20

  const h = Math.abs(hash) % 360
  const s = S_MIN + (Math.abs(hash) % S_RANGE)
  const l = L_MIN + (Math.abs(hash) % L_RANGE)

  return `hsl(${h}, ${s}%, ${l}%)`
}
