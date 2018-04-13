import { view } from '@mcro/black'
import { Title } from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitIcon from './orbitIcon'
import OrbitItemPreview from './orbitItemPreview'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view
export default class Item {
  onClick = () => {
    this.props.appStore.pinSelected(this.props.index, 'click')
  }

  render({
    hidePreview,
    titleProps,
    iconProps,
    appStore,
    index,
    result,
    total,
    theme,
    padding,
    results,
    ...props
  }) {
    appStore.activeIndex
    // const isSelected = appStore.selectedIndex === index
    const shouldShowIcon = result.icon || result.integration || result.type
    if (!result) {
      return null
    }
    const ITEM_PAD = 15
    return (
      <orbitItem
        css={{
          padding: padding || ITEM_PAD,
        }}
        onClick={this.onClick}
        {...props}
      >
        <titles>
          <Title
            size={1.3}
            sizeLineHeight={1}
            ellipse={2}
            fontWeight={400}
            css={{
              width: 'calc(100% - 25px)',
            }}
            {...titleProps}
          >
            {result.title}
          </Title>
          <div $$flex />
          <OrbitIcon
            if={shouldShowIcon}
            icon={result.icon ? `/icons/${result.icon}` : result.type}
            size={12}
            css={{
              opacity: 0.5,
              marginLeft: 0,
              marginTop: 3,
            }}
            {...iconProps}
          />
        </titles>
        <OrbitItemPreview if={!hidePreview} result={result} />
      </orbitItem>
    )
  }

  static style = {
    orbitItem: {
      position: 'relative',
      overflow: 'hidden',
    },
    space: {
      height: 20,
    },
    titles: {
      flexFlow: 'row',
      alignItems: 'flex-start',
      padding: [2, 5, 2, 0],
    },
  }

  static theme = ({ appStore, index }, theme) => {
    const isSelected = appStore.activeIndex === index
    const hoveredStyle = {
      background: isSelected
        ? theme.activeHover.background
        : theme.hover.background,
    }
    return {
      orbitItem: {
        background: isSelected ? theme.active.background : 'transparent',
        '&:hover': hoveredStyle,
      },
    }
  }
}
