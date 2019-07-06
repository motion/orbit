import { createApp } from '@o/kit'
import SearchApp from '@o/search-app'
import React from 'react'

export default createApp({
  id: 'quickFind',
  icon: 'search',
  name: 'Search',
  app: QuickFindApp,
})

function QuickFindApp(props) {
  const View = SearchApp.app
  return <View {...props} />
}
