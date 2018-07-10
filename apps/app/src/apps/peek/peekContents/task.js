import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../index'

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
  render({ bit, appStore, children }) {
    return (
      <PeekBitResolver appStore={appStore} bit={bit}>
        {({ title, location, content, comments, icon, permalink }) => {
          return children({
            title,
            subtitle: location,
            icon,
            permalink,
            content: (
              <>
                <bodyContents
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
                <comments>{comments}</comments>
              </>
            ),
          })
        }}
      </PeekBitResolver>
    )
  }

  static style = {
    bodyContents: {
      whiteSpace: 'pre-line',
      padding: 10,
      overflow: 'hidden',
    },
  }
}
