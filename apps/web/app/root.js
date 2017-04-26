import { view } from '~/helpers'
import { Input, Button, Link } from '~/views'
import { HEADER_HEIGHT } from '~/constants'
import NotFound from '~/pages/notfound'
import Router from '~/router'
import Sidebar from '~/views/layout/sidebar'
import Errors from '~/views/layout/errors'

@view
export default class Root {
  prevent = e => e.preventDefault()

  render() {
    const CurrentPage = Router.activeView || NotFound
    const { title, actions, header } = App.views
    console.log('App.views', App.views)

    return (
      <layout $$draggable>
        <main>
          <header if={!!header || !!title || !!actions}>
            <nav>
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
      flex: 3,
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
    action: {
      margin: [0, 0, 0, 5],
    },
  }
}
