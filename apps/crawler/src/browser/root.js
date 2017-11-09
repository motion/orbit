// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const clean = str => str.replace(/[\r\n|\n|\r|\s]+/gm, ' ').trim()

const PreviewTitle = props => <UI.Text size={1.5} {...props} />
const PreviewText = ({ children, ...props }) => (
  <UI.Text size={1.5} opacity={0.5} margin={[0, 10]} ellipse {...props}>
    {clean(children)}
  </UI.Text>
)

const HL_CLASS = '__orbit_highlight'

@view({
  store: class CrawlerStore {
    parentNode = null
    lastEvent = null
    step = 'title'
    highlighted = null
    selected = {
      title: null,
      titleClass: null,
      body: null,
      bodyClass: null,
    }

    willMount() {
      this.on(document, 'mousemove', e => {
        if (this.highlighted) {
          this.lastEvent.dispose()
          this.highlighted.classList.remove(HL_CLASS)
        }
        if (!this.step) {
          return
        }
        if (this.parentNode && this.parentNode.contains(e.target)) {
          return
        }
        this.highlighted = e.target
        this.highlighted.classList.add(HL_CLASS)
        this.lastEvent = this.on(this.highlighted, 'click', e => {
          e.preventDefault()
          e.stopPropagation()
          this.selectCurrent()
          this.nextStep()
        })
      })

      this.watch(() => {
        if (!this.highlighted || !this.step) {
          return
        }
        this.selectCurrent()
      })
    }

    selectCurrent = () => {
      const selector = this.highlighted.className
        .replace(HL_CLASS, '')
        .trim()
        .split(' ')
        .join('.')
      this.selected = {
        ...this.selected,
        [this.step]: this.highlighted.innerText,
        [`${this.step}Class`]: selector ? `.${selector}` : '',
      }
    }

    nextStep() {
      if (this.step === 'title') {
        this.step = 'body'
      } else if (this.step === 'body') {
        this.step = null
      }
    }

    stepSelect(key) {
      return () => {
        this.step = key
      }
    }

    setParent = ref => {
      this.parentNode = ref
    }
  },
})
export default class Root extends React.Component {
  render({ store }) {
    const activeButtonProps = {
      hoverBackground: '#fff',
      background: '#fff',
      hoverColor: '#000',
      color: '#000',
    }

    return (
      <UI.Theme name="dark">
        <crawler ref={store.setParent}>
          <style
            type="text/css"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{
              __html: `
.__orbit_highlight { background: rgba(0%, 62.5%, 84.7%, 0.25) !important;  }
              `,
            }}
          />

          <preview $$flex>
            <previewLine>
              <PreviewTitle>Title:</PreviewTitle>
              <PreviewTitle
                if={store.selected.titleClass}
                color="yellow"
                css={{ marginLeft: 10 }}
              >
                {store.selected.titleClass}
              </PreviewTitle>
              <PreviewText>
                {store.selected.title || 'None selected'}
              </PreviewText>
            </previewLine>
            <previewLine>
              <PreviewTitle>Body:</PreviewTitle>
              <PreviewTitle
                if={store.selected.bodyClass}
                color="yellow"
                css={{ marginLeft: 10 }}
              >
                {store.selected.bodyClass}
              </PreviewTitle>
              <PreviewText>
                {store.selected.body || 'None selected'}
              </PreviewText>
            </previewLine>
          </preview>

          <section $$flex $$row>
            <UI.Row itemProps={{ size: 1.2 }}>
              <UI.Button background="transparent">Settings:</UI.Button>
              <UI.Button>Max Pages: 1,000</UI.Button>
            </UI.Row>
            <flex css={{ flex: 1 }} />
            <UI.Row itemProps={{ size: 1.2 }}>
              <UI.Button background="transparent">Select content:</UI.Button>
              <UI.Button
                {...store.step === 'title' && activeButtonProps}
                onClick={store.stepSelect('title')}
              >
                1. Title
              </UI.Button>
              <UI.Button
                {...store.step === 'body' && activeButtonProps}
                onClick={store.stepSelect('body')}
              >
                2. Body
              </UI.Button>
              <UI.Button icon="bug" theme="#23c161">
                Begin
              </UI.Button>
            </UI.Row>
          </section>
        </crawler>
      </UI.Theme>
    )
  }

  static style = {
    crawler: {
      padding: [10, 110],
      margin: [0, -100],
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#111',
      zIndex: Number.MAX_SAFE_INTEGER,
      boxShadow: [[0, 0, 50, [0, 0, 0, 0.35]]],
      transform: {
        z: Number.MAX_SAFE_INTEGER,
      },

      '& *': {
        display: 'flex',
      },
    },
    space: {
      width: 10,
    },
    preview: {
      padding: 10,
      paddingTop: 5,
    },
    previewLine: {
      flexFlow: 'row',
      alignItems: 'center',
    },
  }
}
