import { $, view } from '~/helpers'
import { HEADER_HEIGHT } from '~/constants'
import Router from '~/router'

@view
export class Page {
  render({ title, actions, children, header, ...props }) {
    return (
      <pagemain {...props}>
        <header if={header || title || actions}>
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
            {header}
            <actions $$row if={actions}>
              {actions.map((action, i) => <action key={i}>{action}</action>)}
            </actions>
          </rest>
        </header>
        <content>
          {children}
        </content>
      </pagemain>
    )
  }
  static style = {
    pagemain: {
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
      fontSize: 12,
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
  static theme = {
    header: () => ({
      content: {
        position: 'relative',
        marginTop: HEADER_HEIGHT,
        flex: 1,
        overflowY: 'scroll',
      },
    }),
  }
}

Page.Side = $('side', {
  width: 200,
  padding: 0,
  flex: 1,
})

Page.Head = $('header', {})
