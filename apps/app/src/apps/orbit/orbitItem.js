import { view } from '@mcro/black'
import { Title } from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitIcon from './orbitIcon'
import OrbitItemPreview from './orbitItemPreview'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view.attach('appStore', 'orbitPage')
@view
export default class Item {
  onClick = () => {
    this.props.appStore.setSelected(this.props.index)
  }

  render({
    hidePreview,
    titleProps,
    iconProps,
    appStore,
    orbitPage,
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
    const shouldShowIcon =
      !results[index - 1] || results[index - 1].type !== result.type
    // log(`OrbitItem isSelected ${isSelected} ${index}`)
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
          <OrbitIcon
            if={shouldShowIcon}
            icon={result.icon ? `/icons/${result.icon}` : result.integration}
            size={18}
            css={{
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
    console.log('s', appStore.activeIndex, index)
    const isSelected = appStore.activeIndex === index
    log(`isSelected ${isSelected}`)
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
