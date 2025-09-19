import { fetchChromiumBookmarks } from './bookmark/chrome'
import { fetchVscodeLikeProjects } from './editor/vscode'

// This map links an app ID to its specific data-fetching function.
export const fetcherMap = {
  vscode: fetchVscodeLikeProjects,
  cursor: fetchVscodeLikeProjects,
  chrome: fetchChromiumBookmarks,
  edge: fetchChromiumBookmarks,
}
