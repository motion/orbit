import React from 'react'
import { view, observable } from '~/helpers'
import { object } from 'prop-types'
import { Segment, Input, Link, Button, Icon } from '~/ui'
import { SIDEBAR_WIDTH, HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from '~/views/layout/sidebar'
import Errors from '~/views/layout/errors'
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
  }

  lastScrolledTo = 0

  onScroll = e => {
    this.lastScrolledTo = e.currentTarget.scrollTop
  }

  render({ store }) {
    const CurrentPage = Router.activeView || NotFound
    const { title, actions, header, doc, place } = App.activePage
    const { extraActions } = App

    console.log(
      'root.render',
      Router.key,
      App.dragStartedAt,
      this.lastScrolledTo
    )

    return (
      <layout $$draggable>
        <main
          onScroll={this.onScroll}
          $dragStartedAt={App.dragStartedAt !== false && this.lastScrolledTo}
        >
          <header
            $hovered={this.headerHovered}
            onMouseEnter={() => (this.headerHovered = true)}
            onMouseLeave={() => (this.headerHovered = false)}
          >
            <nav>
              <Segment>
                <Button
                  if={IS_ELECTRON}
                  icon="minimal-left"
                  chromeless
                  $inactive={Router.atBack}
                  onClick={() => Router.back()}
                />
                <Button
                  if={IS_ELECTRON}
                  chromeless
                  $inactive={Router.atFront}
                  icon="minimal-right"
                  onClick={() => Router.forward()}
                />
                <Button if={false} icon="simple-add" tooltip="new" />
              </Segment>
            </nav>
            <bar $$centered $$flex $$row $$overflow="hidden">
              <Commander
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
      overflowX: 'visible',
      overflowY: 'scroll',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: SIDEBAR_WIDTH,
      zIndex: 10,
    },
    dragStartedAt: pos => ({
      overflowX: 'visible',
      overflowY: 'visible',
      transform: {
        y: -pos,
      },
    }),
    content: {
      flex: 1,
      position: 'relative',
      overflow: 'visible',
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
