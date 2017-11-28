import * as Constants from '~/constants'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class Drawer {
  static defaultProps = {
    theme: 'dark',
    background: '#333',
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
    after,
    ...props
  }) {
    return (
      <UI.Theme name={theme}>
        <UI.Drawer
          open={open}
          from="bottom"
          boxShadow={[[0, 0, 20, [20, 20, 20, 0.25]]]}
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
                css={{ position: 'absolute', top: 3, right: 5 }}
                itemProps={{
                  chromeless: true,
                  size: 0.9,
                  color: [255, 255, 255, 0.5],
                  hoverColor: [255, 255, 255, 0.8],
                }}
              >
                <UI.Button
                  if={collapsable}
                  icon={collapsed ? 'arrow-min-up' : 'arrow-min-down'}
                  onClick={onCollapse}
                />
                <UI.Button if={closable} icon="remove" onClick={onClose} />
              </UI.Row>
            </title>
            <outerContent>
              <content {...contentProps}>{children}</content>
              <after if={open && !collapsed && after}>{after}</after>
            </outerContent>
          </container>
        </UI.Drawer>
      </UI.Theme>
    )
  }

  static style = {
    container: {
      flex: 1,
    },
    outerContent: {
      flex: 1,
      paddingBottom: Constants.ACTION_BAR_HEIGHT,
    },
    after: {
      padding: [5, 105],
      position: 'absolute',
      backdropFilter: 'blur(20px)',
      background: [255, 255, 255, 0.15],
      bottom: Constants.ACTION_BAR_HEIGHT,
      left: 0,
      right: 0,
    },
    content: {
      padding: 5,
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
