import { exec } from 'node:child_process'
import { showToast, Toast } from '@raycast/api'

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
