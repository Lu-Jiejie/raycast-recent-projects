import { adapterMap } from '../../adapters'
import { BookmarkList } from '../bookmark/BookmarkList'

export function createBookmarkListView(appKey: keyof typeof adapterMap.bookmark) {
  return function BookmarkListView() {
    const adapter = adapterMap.bookmark[appKey]

    return (
      <BookmarkList
        adapter={adapter}
        searchBarPlaceholder={adapter.searchBarPlaceholder}
      />
    )
  }
}
