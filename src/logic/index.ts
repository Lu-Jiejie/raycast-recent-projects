import { showToast, Toast } from '@raycast/api'

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

export async function withErrorHandling<T>(
  operation: () => Promise<T> | T,
  errorTitle: string,
  successToast?: {
    title: string
    message: string
  },
): Promise<T | null> {
  try {
    const result = await operation()
    // 只有在操作成功时才显示成功提示
    if (successToast) {
      await showSuccessToast(successToast.title, successToast.message)
    }
    return result
  }
  catch (error) {
    await showErrorToast(errorTitle, error instanceof Error ? error.message : 'Unknown error occurred')
    return null
  }
}
