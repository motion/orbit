// @flow
import { view, observable } from '~/helpers'
import { Input, Button, Link } from '~/views'
import { HEADER_HEIGHT, IS_ELECTRON } from '~/constants'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from '~/views/layout/sidebar'
import Errors from '~/views/layout/errors'

@view
export default class Root {
  prevent = (e: Event) => e.preventDefault()

  @observable headerHovered = true

  componentDidMount() {
    this.headerHovered = false
  }

  render() {
    const CurrentPage = Router.activeView || NotFound
    const { title, actions, header } = App.views

    return (
      <layout $$draggable>
        <main>
          <header
            $hovered={this.headerHovered}
            onMouseEnter={() => (this.headerHovered = true)}
            onMouseLeave={() => (this.headerHovered = false)}
            if={!!header || !!title || !!actions}
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
            <omnibar>
              <input $omniinput />
            </omnibar>
            <title if={title}>
              {title}
            </title>
            <rest $$flex $$row>
              {header || null}
              <actions $$row if={actions}>
                {actions.map((action, i) => <action key={i}>{action}</action>)}
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
      overflowY: 'scroll',
    },
    content: {
      flex: 1,
      position: 'relative',
      overflowY: 'scroll',
      marginTop: HEADER_HEIGHT,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: 10,
      paddingLeft: IS_ELECTRON ? 80 : 10,
      alignItems: 'center',
      flexFlow: 'row',
      height: HEADER_HEIGHT,
      background: '#fff',
      zIndex: 1000,
      transition: 'all ease-out 300ms',
      transitionDelay: '400ms',
    },
    omnibar: {
      flex: 10,
      margin: [0, 'auto'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    omniinput: {
      width: '100%',
      background: '#f4f4f4',
      border: 'none',
      padding: [6, 10],
      fontSize: 16,
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
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    nav: {
      flexFlow: 'row',
      marginRight: 10,
    },
    btn: {
      padding: [8, 6],
      opacity: 0.2,
      '&:hover': {
        opacity: 1,
      },
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
  }
}
