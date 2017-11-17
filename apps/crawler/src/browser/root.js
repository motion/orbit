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

    // syncs to ora
    // see window.__oraCrawlerAnswer below
    state = {
      closed: false,
      title: null,
      titleSelector: null,
      body: null,
      bodySelector: null,
    }

    willMount() {
      // follow mouse + highlight
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
        // click to select node
        this.lastEvent = this.on(this.highlighted, 'click', e => {
          e.preventDefault()
          e.stopPropagation()
          this.selectCurrent()
          this.nextStep()
        })
      })

      // once we have highlighted + step, select something
      this.watch(() => {
        if (!this.highlighted || !this.step) {
          return
        }
        this.selectCurrent()
      })

      // sets the answer to send back to ora
      this.watch(() => {
        window.__oraCrawlerAnswer = {
          ...this.state,
          entry: window.location.href,
        }

        if (this.state.closed) {
          this.props.onClose()
        }
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
          finalSelector = `.${parentInfo.className} > ${tagName}`
        } else {
          finalSelector = `${parentInfo.tagName} > ${tagName}`
        }
      }

      this.setState({
        [this.step]: this.highlighted.innerText.slice(0, 200),
        [`${this.step}Selector`]: finalSelector,
      })
    }

    setState = nextState => {
      this.state = {
        ...this.state,
        ...nextState,
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
        <aside if={!store.state.closed}>
          <span>
            <aside $crawler ref={store.setParent}>
              <crawlerInner>
                <style
                  type="text/css"
                  style={{ display: 'none' }}
                  dangerouslySetInnerHTML={{
                    __html: `
${store.state.titleSelector} {
  background: yellow;
}
${store.state.bodySelector} {
  background: lightgreen;
  position: relative;
  z-index: 10000000;
}
              `,
                  }}
                />

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

                <controls>
                  <UI.Button
                    onClick={() => {
                      store.setState({
                        closed: true,
                      })
                    }}
                  >
                    Cancel
                  </UI.Button>
                </controls>

                <preview $$flex>
                  <previewLine>
                    <PreviewTitle color="yellow">Title:</PreviewTitle>
                    <PreviewTitle
                      if={store.state.titleSelector}
                      color="yellow"
                      opacity={0.5}
                      css={{ marginLeft: 10 }}
                    >
                      {store.state.titleSelector}
                    </PreviewTitle>
                    <PreviewText>
                      {store.state.title || 'None selected'}
                    </PreviewText>
                  </previewLine>
                  <previewLine>
                    <PreviewTitle color="lightgreen">Body:</PreviewTitle>
                    <PreviewTitle
                      if={store.state.bodySelector}
                      color="lightgreen"
                      opacity={0.5}
                      css={{ marginLeft: 10 }}
                    >
                      {store.state.bodySelector}
                    </PreviewTitle>
                    <PreviewText>
                      {store.state.body || 'None selected'}
                    </PreviewText>
                  </previewLine>
                </preview>

                <section $$flex $$row>
                  <flex css={{ flex: 1 }} />
                  <UI.Row>
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
                  </UI.Row>
                </section>
              </crawlerInner>
            </aside>
          </span>
        </aside>
      </UI.Theme>
    )
  }

  static style = {
    crawler: {
      isolate: true,
      fontFamily: `"Helvetica Nueue", Helvetica, Arial, sans-serif`,
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: Number.MAX_SAFE_INTEGER - 2,
      transform: {
        z: Number.MAX_SAFE_INTEGER - 2,
      },
    },
    crawlerInner: {
      background: '#111',
      boxShadow: [[0, 0, 50, [0, 0, 0, 0.35]]],
      margin: [0, -100],
      padding: [10, 110],
    },
    space: {
      isolate: true,
      width: 10,
    },
    preview: {
      isolate: true,
      padding: 10,
      paddingTop: 5,
    },
    previewLine: {
      isolate: true,
      flexFlow: 'row',
      alignItems: 'center',
    },
    controls: {
      position: 'absolute',
      top: 10,
      right: 10,
      flexFlow: 'row',
      alignItems: 'center',
      zIndex: 10,
    },
  }
}
