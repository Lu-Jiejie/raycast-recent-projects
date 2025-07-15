import { showToast, Toast } from '@raycast/api'

/**
 * 显示成功提示
 * @param title 标题
 * @param message 消息内容
 * @returns Promise<void>
 */
export function showSuccessToast(title: string, message: string) {
  return showToast({
    style: Toast.Style.Success,
    title,
    message,
  })
}

/**
 * 显示错误提示
 * @param title 标题
 * @param message 消息内容
 * @returns Promise<void>
 */
export function showErrorToast(title: string, message: string) {
  return showToast({
    style: Toast.Style.Failure,
    title,
    message,
  })
}
