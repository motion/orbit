import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { themes } from './themes'
import { ThemeProvide } from '@mcro/gloss'
import { OrbitCard } from '../../app/src/apps/orbit/OrbitCard'

const decorator = compose(
  view.attach({
    store: class {
      state = {
        hello: 'notworld',
      }

      willMount() {
        setTimeout(() => {
          this.state = {
            hello: 'world',
          }
        }, 1000)
      }
    },
  }),
  view,
)

const SomeSubView = decorator(({ store }) => {
  return (
    <div>
      123 123
      {store.state.hello === 'world' ? <SomeOtherSubView /> : <div>hiii</div>}
    </div>
  )
})

const subDecorator = compose(
  view.attach({
    store: class {
      state = 'wut'

      willMount() {
        setTimeout(() => {
          this.state = 'yeeeeeeeeeeee'
        }, 1000)
      }
    },
  }),
  view,
)

const SomeOtherSubView = subDecorator(({ store }) => {
  return <div>{store.state}</div>
})

const Test = view({
  color: 'gray',
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
  bigFont: {
    fontSize: 30,
    '&:hover': {
      fontSize: 10,
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
  color: big ? 'pink' : theme.base.color,
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

const RootViewInner = () => {
  return (
    <ThemeProvide themes={themes} activeTheme="light">
      <div style={{ pointerEvents: 'all', width: '100%', height: '100%' }}>
        <SomeSubView />

        {/* <div style={{ flex: 1, overflowY: 'scroll' }}>
          <box style={{ height: 500 }} />
          <box style={{ height: 500 }} />
          <UI.Button glow glowProps={{ color: '#000' }}>
            hello world
          </UI.Button>
          <box style={{ height: 500 }} />
          <box style={{ height: 500 }} />
        </div> */}
        {/* <Test>blue hover orange</Test>
        <Test big>pink hover pinker</Test>
        <Test2 bigFont>red faint</Test2>
        <Test2 big debug>
          pink bold on yellow opacity 1
        </Test2>
        <Test3>red italic hover black</Test3>

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

        <UI.Button icon="ic">Hello World</UI.Button>
        <UI.Input icon="ic" />

        <UI.Theme theme={{ background: '#4B7BD4', color: 'white' }}>
          <UI.Button size={2} icon="ic">
            Hello World
          </UI.Button>
          <UI.Input icon="ic" size={2} />
        </UI.Theme>

        <UI.Theme theme="darkred">
          <UI.Button size={2} icon="ic">
            Hello World
          </UI.Button>
          <UI.Input icon="ic" size={2} />
        </UI.Theme>

        <UI.Theme theme="pink">
          <UI.Button size={2} icon="ic">
            Hello World
          </UI.Button>
          <UI.Input icon="ic" size={2} />
        </UI.Theme>

        <UI.Button circular size={2} icon="ic" />

        <UI.Theme name="dark">
          <UI.Button size={3} icon="ic">
            Hello World
          </UI.Button>
          <UI.Input icon="ic" size={3} />
        </UI.Theme> */}
      </div>
    </ThemeProvide>
  )
}

export const RootView = RootViewInner
