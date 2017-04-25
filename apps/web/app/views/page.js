import { $, view } from '~/helpers'

const HEADER_HEIGHT = 60

@view
export class Page {
  render({ title, children, header, ...props }) {
    return (
      <pagemain {...props}>
        <header if={header || title}>
          <title if={title}>
            {title}
          </title>
          <rest>
            {header}
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
