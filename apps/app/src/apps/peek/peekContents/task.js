import * as React from 'react'
import { view } from '@mcro/black'
import { PeekHeader } from '../peekHeader'
import { PeekContent } from '../PeekContent'
import bitContents from '~/components/bitContents'

// bit.body =
// {
//   "id": "MDU6SXNzdWUzMzI0OTcxNzA=",
//   "title": "Upgrade chaos monkey stack",
//   "number": 253,
//   "body": "One pain point is `build --watch`.\r\n\r\n- [ ] We should detect somehow if it's not running, and wait for it to run before apps continue\r\n- [ ] That should be inside the nodemon part, so if an app restarts and `build --watch` isn't running, it waits again\r\n- [ ] it causes all the apps to restart a bunch, but this shouldn't happen on second builds (at least for tsc, maybe this is babel's doing?) lets find/create tickets for that.\r\n",
//   "updatedAt": "2018-06-14T17:35:38Z",
//   "createdAt": "2018-06-14T17:35:38Z",
//   "author": {
//     "avatarUrl": "https://avatars0.githubusercontent.com/u/12100?v=4",
//     "login": "natew"
//   },
//   "labels": [],
//   "comments": [],
//   "repositoryName": "orbit",
//   "orgLogin": "motion"
// }

@view
export class Task extends React.Component {
  render({ bit, appStore }) {
    if (!bit) {
      console.warn('no bit for task123')
      return null
    }
    console.log('rendering yo', bit)
    const BitContent = bitContents(bit)
    return (
      <BitContent
        appStore={appStore}
        bit={bit}
        shownLimit={Infinity}
        isExpanded
      >
        {({ title, content, comments }) => {
          return (
            <>
              <PeekHeader title={title} />
              <PeekContent>
                <bodyContents
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
                <comments>{comments}</comments>
              </PeekContent>
            </>
          )
        }}
      </BitContent>
    )
  }

  static style = {
    bodyContents: {
      whiteSpace: 'pre-line',
      padding: 10,
      overflow: 'hidden',
      lineHeight: '1.4rem',
    },
  }
}
