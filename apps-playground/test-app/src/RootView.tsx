import * as React from 'react'
import { view, compose } from '@mcro/black'
// import * as UI from '@mcro/ui'
import { themes } from './themes'
import { ThemeProvide } from '@mcro/gloss'
// import { OrbitCard } from '../../app/src/apps/orbit/OrbitCard'
import { TestHMR } from './TestHMR'
import createCss from '@mcro/css'

const css = createCss()

console.log('css', css({ lineHeight: 10 }))

if (process.env.NODE_ENV === 'development') {
  if (module.hot && module.hot.addStatusHandler) {
    if (module.hot.status() === 'idle') {
      module.hot.addStatusHandler(status => {
        if (status === 'prepare') {
          view.emit('will-hmr')
          view.provide.emit('will-hmr')
        }
      })
    }
  }
}

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

const RootViewInner = () => {
  return (
    <ThemeProvide themes={themes} activeTheme="light">
      <div style={{ pointerEvents: 'all', width: '100%', height: '100%' }}>
        <TestHMR />

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
