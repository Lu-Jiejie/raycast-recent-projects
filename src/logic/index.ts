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

  const h = Math.abs(hash) % 360
  const s = 60 + (Math.abs(hash) % 20)
  const l = 40 + (Math.abs(hash) % 20)

  return `hsl(${h}, ${s}%, ${l}%)`
}
