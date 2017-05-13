import { view, observable } from '~/helpers'
import { object } from 'prop-types'
import { Input, CircleButton, Link, Button, Icon } from '~/views'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from '~/views/layout/sidebar'
import Errors from '~/views/layout/errors'
import Mousetrap from 'mousetrap'
import { Document } from '@jot/models'
import Commander from '~/views/commander'
import Keys from '~/stores/keys'

@view({
  store: class LayoutStore {
    title = ''

    createDoc = () => {
      Document.create({ title: this.title, places: [App.activePlace] })
    }
  },
})
export default class Root {
  static childContextTypes = {
    shortcuts: object,
  }

  getChildContext() {
    return { shortcut: Keys.manager }
  }

  prevent = (e: Event) => e.preventDefault()

  @observable headerHovered = true

  componentDidMount() {
    this.headerHovered = false
    Mousetrap.bind('command+n', () => {
      Document.create()
    })
  }

  render({ store }) {
    const CurrentPage = Router.activeView || NotFound
    const { title, actions, header, doc, place } = App.activePage
    const { extraActions } = App

    return (
      <layout $$draggable>
        <main>
          <header
            $hovered={this.headerHovered}
            onMouseEnter={() => (this.headerHovered = true)}
            onMouseLeave={() => (this.headerHovered = false)}
          >
            <nav if={IS_ELECTRON}>
              <back $btn $active={!Router.atBack} onClick={() => Router.back()}>
                {'<'}
              </back>
              <fwd
                $btn
                $active={!Router.atFront}
                onClick={() => Router.forward()}
              >
                {'>'}
              </fwd>
              <btn $active={Router.path !== '/'} onClick={() => Router.go('/')}>
                🏚
              </btn>
            </nav>
            <title if={title}>
              {title}
            </title>
            <view $$flex />
            <rest if={header || actions || extraActions} $$row>
              {header || null}
              <actions $$row if={extraActions}>
                {extraActions.map((xa, i) => <action key={i}>{xa}</action>)}
              </actions>
              <actions $$row if={actions}>
                {actions.map((action, i) => <action key={i}>{action}</action>)}
              </actions>
            </rest>
          </header>
          <content>
            <CurrentPage key={Router.key} />
          </content>
          <statusbar>
            <omnibar>
              <Commander
                placeholder="new..."
                onSubmit={store.createDoc}
                onChange={store.ref('title').set}
                $omniinput
              />
              <CircleButton
                $createButton
                icon={<Icon name="ui-add" />}
                onClick={store.createDoc}
              />
              <Button icon="🖼" />
              <Button icon="😊" />
            </omnibar>
          </statusbar>
        </main>
        <Errors />
        <Sidebar />
      </layout>
    )
  }

  static style = {
    layout: {
      flex: 1,
      flexFlow: 'row',
    },
    main: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      position: 'relative',
    },
    header: {
      background: [255, 255, 255, 0.1],
      zIndex: 1000,
      padding: [0, 10, 0, IS_ELECTRON ? 80 : 10],
      flexFlow: 'row',
      height: HEADER_HEIGHT,
      transition: 'all ease-out 300ms',
      transitionDelay: '400ms',
    },
    hovered: {
      opacity: 1,
      transition: 'all ease-in 100ms',
      transitionDelay: '0',
    },
    title: {
      flex: 1,
      justifyContent: 'flex-end',
      fontSize: 14,
      fontWeight: 600,
    },
    rest: {
      justifyContent: 'center',
    },
    nav: {
      flexFlow: 'row',
      marginRight: 10,
      alignItems: 'center',
    },
    btn: {
      padding: [8, 6],
      opacity: 0.2,
      '&:hover': {
        opacity: 1,
      },
    },
    omnibar: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    omniinput: {},
    createButton: {
      margin: [-10, 0, -10, -20],
    },
    active: {
      opacity: 0.5,
    },
    actions: {
      alignItems: 'center',
    },
    action: {
      margin: [0, 0, 0, 5],
      alignItems: 'center',
    },
    statusbar: {
      flexWrap: 'nowrap',
      overflow: 'hidden',
      padding: 10,
      background: '#fff',
      borderTop: [2, '#eee'],
      position: 'relative',
    },
    tag: {
      padding: [2, 5],
      background: '#fff',
      color: 'red',
      '&:hover': {
        background: '#eee',
      },
    },
    form: {
      width: '100%',
      padding: 10,
    },
    create: {
      width: '100%',
      padding: [8, 7],
      fontSize: 16,
      background: '#fff',
      border: [1, '#ddd'],
    },
  }
}
