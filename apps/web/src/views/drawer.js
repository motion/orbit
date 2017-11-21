import * as Constants from '~/constants'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class OraDrawer {
  static defaultProps = {
    theme: 'dark',
    background: '#222',
    size: 200,
    open: false,
    progress: false,
    progressProps: null,
    title: '',
    titleProps: null,
    collapsable: true,
    collapsed: false,
    onCollapse: _ => _,
    closable: false,
    onClose: _ => _,
  }

  render({
    onCollapse,
    title,
    titleProps,
    open,
    theme,
    background,
    size,
    progress,
    progressProps,
    collapsable,
    collapsed,
    children,
    closable,
    onClose,
    ...props
  }) {
    return (
      <UI.Theme name={theme}>
        <UI.Drawer
          open={open}
          from="bottom"
          boxShadow="0 0 100px #000"
          background={background}
          size={size}
          {...props}
        >
          <container if={children}>
            <title if={title}>
              <UI.Progress.Circle
                if={typeof progress !== 'boolean'}
                css={{ marginRight: 10 }}
                lineColor="green"
                size={18}
                percent={progress}
                {...progressProps}
              />
              <UI.Title fontWeight={600} size={1} {...titleProps}>
                {title}
              </UI.Title>
              <UI.Row
                spaced
                css={{ position: 'absolute', top: 5, right: 7 }}
                itemProps={{ chromeless: true, size: 0.9, opacity: 0.8 }}
              >
                <UI.Button
                  if={collapsable}
                  icon={collapsed ? 'arrow-min-down' : 'arrow-min-up'}
                  onClick={onCollapse}
                />
                <UI.Button if={closable} icon="remove" onClick={onClose} />
              </UI.Row>
            </title>
            <content>{children}</content>
          </container>
        </UI.Drawer>
      </UI.Theme>
    )
  }

  static style = {
    content: {
      padding: 10,
      paddingBottom: Constants.ACTION_BAR_HEIGHT + 10,
      flex: 1,
      flexFlow: 'row',
      maxWidth: '100%',
      overflow: 'hidden',
      overflowY: 'scroll',
    },
    title: {
      background: [0, 0, 0, 0.05],
      padding: [5, 7],
      flexFlow: 'row',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
    },
  }
}
