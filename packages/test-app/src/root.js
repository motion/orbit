import * as React from 'react'
import { view } from '@mcro/black'

// this static style should override the grandparent dynamic
// ... looks like it does! :)
const Test = view({
  background: 'blue',
  height: 100,
  width: 100,
  '&:hover': {
    background: 'orange',
  },
  big: {
    background: 'pink',
    '&:hover': {
      background: 'violet',
    },
  },
})

// extend and test
const Test2 = view(Test, {
  background: 'red',
  opacity: 0.5,
  big: {
    opacity: 1,
    background: 'yellow',
    '&:hover': {
      background: 'green',
    },
  },
})

Test2.theme = ({ theme, big }) => ({
  fontStyle: 'italic',
  fontWeight: big ? 'bold' : 'light',
  color: big ? 'white' : theme.base.color,
})

// extend theme
const Test3 = view(Test2, {
  opacity: 1,
})

Test3.theme = () => ({
  '&:hover': {
    background: 'black',
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
      <Test2 big>white bold</Test2>
      <Test3>italic hover black</Test3>

      <br />
      <br />

      {/* <UI.FullScreen>
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
      </UI.FullScreen> */}
    </div>
  )
}
