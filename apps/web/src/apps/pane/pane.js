import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneStore from './paneStore'

@view({
  paneStore: PaneStore,
})
export default class Pane {
  onSelect = (item, index) => {
    if (item.onClick) {
      item.onClick()
    } else {
      this.props.onSelect(item, index)
    }
  }

  render({
    getItem,
    groupKey,
    listProps,
    virtualProps,
    itemProps,
    items,
    paneStore,
    getActiveIndex,
    children,
    style,
    width,
    theme,
    primary,
    actionBar,
    index,
    title,
    onBack,
  }) {
    const getItemDefault = (item, index) => ({
      highlight: () => index === getActiveIndex(),
      children: item,
    })

    return (
      <UI.Theme name={theme}>
        <card
          style={{ width, ...style }}
          $fullscreen={paneStore.fullscreen}
          $primary={primary}
          $secondary={!primary}
        >
          <title if={title}>
            <UI.Button
              $backButton
              if={index > 0}
              circular
              icon="arrominleft"
              onClick={onBack}
            />
            <UI.Title size={1.5}>{title}</UI.Title>
          </title>
          <content if={!items}>{children}</content>
          <content if={items}>
            <UI.List
              getRef={paneStore.setList}
              groupKey={groupKey}
              onSelect={this.onSelect}
              virtualized={{
                measure: true,
                ...virtualProps,
              }}
              itemProps={{
                padding: 0,
                highlightBackground: [0, 0, 0, 0.08],
                highlightColor: [255, 255, 255, 1],
                ...itemProps,
              }}
              items={items}
              getItem={getItem || getItemDefault}
              {...listProps}
            />
          </content>
          <actions if={actionBar}>{actionBar}</actions>
        </card>
      </UI.Theme>
    )
  }

  static style = {
    card: {
      flex: 1,
      transition: 'all ease-in 80ms',
      zIndex: 1000,
      position: 'relative',
      overflowY: 'scroll',
    },
    primary: {
      marginTop: 5,
    },
    content: {
      overflowY: 'scroll',
      flex: 1,
    },
    fullscreen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#fff',
      zIndex: 10000000,
    },
    title: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [5, 10],
    },
    backButton: {
      marginRight: 10,
    },
  }
}
