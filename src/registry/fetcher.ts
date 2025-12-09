import { fetchChromiumBookmarks } from '../fetchers/chrome'
import { fetchTyporaProjects } from '../fetchers/typora'
import { fetchVscodeLikeProjects } from '../fetchers/vscode'

export const fetcherMap = {
  vscode: fetchVscodeLikeProjects,
  cursor: fetchVscodeLikeProjects,
  chrome: fetchChromiumBookmarks,
  edge: fetchChromiumBookmarks,
  typora: fetchTyporaProjects,
}
