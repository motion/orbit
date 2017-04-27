import { view, observable } from '~/helpers'
import { Input, Button, Link } from '~/views'
import { HEADER_HEIGHT } from '~/constants'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from '~/views/layout/sidebar'
import Errors from '~/views/layout/errors'

@view
export default class Root {
  prevent = e => e.preventDefault()

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
            onMouseEnter={() => this.headerHovered = true}
            onMouseLeave={() => this.headerHovered = false}
            if={!!header || !!title || !!actions}
          >
            <nav>
              <btn $active={Router.path !== '/'} onClick={() => Router.go('/')}>
                🏚
              </btn>
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
            </nav>
            <title if={title}>
              {title}
            </title>
            <rest>
              {header || null}
              <actions $$row if={actions}>
                {actions.map((action, i) => <action key={i}>{action}</action>)}
              </actions>
            </rest>
          </header>
          <content $withHeader={!!header}>
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
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: 10,
      paddingLeft: 80,
      alignItems: 'center',
      flexFlow: 'row',
      height: HEADER_HEIGHT,
      borderBottom: [1, '#eee'],
      background: '#fff',
      zIndex: 1000,
      opacity: 0.7,
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
    withHeader: {
      position: 'relative',
      marginTop: HEADER_HEIGHT,
      flex: 1,
      overflowY: 'scroll',
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
      padding: 8,
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
