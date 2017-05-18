import { view, observable } from '~/helpers'
import { object } from 'prop-types'
import { Segment, Input, Link, Button, Icon } from '~/ui'
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
    return { shortcuts: Keys.manager }
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
            onMouseEnter={() => this.headerHovered = true}
            onMouseLeave={() => this.headerHovered = false}
          >
            <nav>
              <Segment>
                <Button
                  if={IS_ELECTRON}
                  icon="minimal-left"
                  $inactive={Router.atBack}
                  onClick={() => Router.back()}
                />
                <Button
                  if={IS_ELECTRON}
                  $inactive={Router.atFront}
                  icon="minimal-right"
                  onClick={() => Router.forward()}
                />
                <Button icon="simple-add" tooltip="new" />
              </Segment>
            </nav>
            <bar $$centered $$flex $$row $$overflow="hidden">
              <Commander
                placeholder="..."
                onSubmit={store.createDoc}
                onChange={store.ref('title').set}
                $omniinput
              />
            </bar>
            <rest if={header || actions || extraActions} $$row>
              {header || null}
              <actions $extraActions if={extraActions}>
                {extraActions}
              </actions>
              <actions if={actions}>
                {actions}
              </actions>
            </rest>
          </header>
          <content>
            <CurrentPage key={Router.key} />
          </content>
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
      width: '100%',
      overflow: 'hidden',
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
      marginLeft: 10,
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
    inactive: {
      opacity: 0.5,
      pointerEvents: 'none',
    },
    actions: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    extraActions: {
      marginRight: 10,
    },
  }
}
