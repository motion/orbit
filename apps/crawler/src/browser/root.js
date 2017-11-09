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

const getTagInfo = node => ({
  tagName: node.tagName.toLowerCase(),
  className: (node.className || '')
    .replace(HL_CLASS, '')
    .trim()
    .split(' ')
    .join('.'),
})

@view({
  store: class CrawlerStore {
    parentNode = null
    lastEvent = null
    step = 'title'
    highlighted = null
    selected = {
      title: null,
      titleSelector: null,
      body: null,
      bodySelector: null,
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
      let finalSelector
      const { className, tagName } = getTagInfo(this.highlighted)

      // generates a semi-generic selector
      if (className) {
        finalSelector = `.${className}`
      } else {
        const parentInfo = getTagInfo(this.highlighted.parentNode)
        if (parentInfo.className) {
          finalSelector = `${parentInfo.className} > ${tagName}`
        } else {
          finalSelector = `${parentInfo.tagName} > ${tagName}`
        }
      }

      this.selected = {
        ...this.selected,
        [this.step]: this.highlighted.innerText,
        [`${this.step}Selector`]: finalSelector,
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

    const curPath = window.location.pathname.split('/')
    const parentPath = curPath.slice(0, curPath.length - 1).join('/')
    const parentLocation = parentPath || '/'

    return (
      <UI.Theme name="dark">
        <aside>
          <span>
            <aside $crawler ref={store.setParent}>
              <style
                type="text/css"
                style={{ display: 'none' }}
                // yo dawg, we cant use class selectors to avoid specificity, so this fucking exists
                // aside span aside
                dangerouslySetInnerHTML={{
                  __html: `
.__orbit_highlight { background: rgba(0%, 62.5%, 84.7%, 0.25) !important;  }
aside span aside * { display: flex; flex-flow: column; }
              `,
                }}
              />

              <preview $$flex>
                <previewLine>
                  <PreviewTitle>Title:</PreviewTitle>
                  <PreviewTitle
                    if={store.selected.titleSelector}
                    color="yellow"
                    css={{ marginLeft: 10 }}
                  >
                    {store.selected.titleSelector}
                  </PreviewTitle>
                  <PreviewText>
                    {store.selected.title || 'None selected'}
                  </PreviewText>
                </previewLine>
                <previewLine>
                  <PreviewTitle>Body:</PreviewTitle>
                  <PreviewTitle
                    if={store.selected.bodySelector}
                    color="yellow"
                    css={{ marginLeft: 10 }}
                  >
                    {store.selected.bodySelector}
                  </PreviewTitle>
                  <PreviewText>
                    {store.selected.body || 'None selected'}
                  </PreviewText>
                </previewLine>
              </preview>

              <section $$flex $$row>
                <UI.Row>
                  <UI.Label tooltip="Crawler won't go above this path">
                    Path:
                  </UI.Label>
                  <UI.Field
                    type="input"
                    width={100}
                    row
                    defaultValue={parentLocation}
                  />
                  <UI.Button>Max Pages: 1,000</UI.Button>
                </UI.Row>
                <flex css={{ flex: 1 }} />
                <UI.Row itemProps={{ size: 1.2 }}>
                  <UI.Button background="transparent">
                    Select content:
                  </UI.Button>
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
            </aside>
          </span>
        </aside>
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
      zIndex: Number.MAX_SAFE_INTEGER - 2,
      boxShadow: [[0, 0, 50, [0, 0, 0, 0.35]]],
      transform: {
        z: Number.MAX_SAFE_INTEGER - 2,
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
