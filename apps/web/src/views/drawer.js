import * as Constants from '~/constants'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Drawer {
  static defaultProps = {
    theme: 'dark',
    background: '#222',
    size: 200,
    open: false,
    progressProps: null,
    title: '',
    titleProps: null,
    collapsable: false,
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
    renderTitle,
    renderProgress,
    contentProps,
    ...props
  }) {
    return (
      <UI.Theme name={theme}>
        <UI.Drawer
          open={open}
          from="bottom"
          boxShadow="0 0 100px #000"
          background={background}
          size={collapsed ? 82 : size}
          {...props}
        >
          <container if={open}>
            <title if={renderTitle || title}>
              <UI.Progress.Circle
                if={typeof (renderProgress || progress) !== 'undefined'}
                css={{ marginRight: 10 }}
                lineColor="green"
                size={18}
                percent={renderProgress ? renderProgress() : progress}
                {...progressProps}
              />
              <UI.Title fontWeight={600} size={1} {...titleProps}>
                {renderTitle ? renderTitle() : title}
              </UI.Title>
              <UI.Row
                spaced
                css={{ position: 'absolute', top: 5, right: 7 }}
                itemProps={{ chromeless: true, size: 0.9, opacity: 0.8 }}
              >
                <UI.Button
                  if={collapsable}
                  icon={collapsed ? 'arrow-min-up' : 'arrow-min-down'}
                  onClick={onCollapse}
                />
                <UI.Button if={closable} icon="remove" onClick={onClose} />
              </UI.Row>
            </title>
            <content {...contentProps}>{children}</content>
          </container>
        </UI.Drawer>
      </UI.Theme>
    )
  }

  static style = {
    container: {
      flex: 1,
    },
    content: {
      padding: 5,
      paddingBottom: Constants.ACTION_BAR_HEIGHT + 10, // 10 is padding around app
      flex: 1,
      flexFlow: 'row',
      maxWidth: '100%',
      overflowX: 'hidden',
      overflowY: 'scroll',
    },
    title: {
      background: [0, 0, 0, 0.05],
      padding: [5, 7],
      flexFlow: 'row',
      alignItems: 'center',
      position: 'relative',
      zIndex: 10,
      userSelect: 'none',
    },
  }
}
