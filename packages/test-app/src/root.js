import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

// this static style should override the grandparent dynamic
// ... looks like it does! :)
const Test = view({
  background: 'blue',
  height: 100,
  width: 100,
  big: {
    background: 'pink',
  },
})

// extend and test
const Test2 = view(Test, {
  background: 'red',
  big: {
    background: 'yellow',
    '&:hover': {
      background: 'green',
    },
  },
})

// export type TreeItem = {
//   id: TreeItemID
//   name: string
//   expanded: boolean
//   children: Array<TreeItemID>
//   attributes: Array<TreeItemAttribute>
//   data: TreeItemData
//   decoration: string
// }

export const Root = () => {
  return (
    <div css={{ pointerEvents: 'all', width: '100%', height: '100%' }}>
      <Test>blue</Test>
      <Test big>pink</Test>
      <Test2>red</Test2>
      <Test2 big>yellow</Test2>

      <br />
      <br />

      <UI.FullScreen>
        <UI.Tree
          root="zero"
          elements={{
            zero: {
              id: 'zero',
              name: 'test name',
              expanded: true,
              children: ['one', 'two', 'three'],
            },
            one: {
              id: 'one',
              name: 'test name2',
              expanded: false,
            },
            two: {
              id: 'two',
              name: 'test name3',
              expanded: false,
            },
            three: {
              id: 'three',
              name: 'test name4',
              expanded: false,
            },
          }}
        />
      </UI.FullScreen>
    </div>
  )
}
