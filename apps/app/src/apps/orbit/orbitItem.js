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
    this.props.appStore.setSelectedIndex(this.props.index)
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
    const isSelected = appStore.selectedIndex === index
    const shouldShowIcon =
      !results[index - 1] || results[index - 1].type !== result.type
    // log(`OrbitItem isSelected ${isSelected} ${index}`)
    if (!result) {
      return null
    }
    const orbitHeight = orbitPage.contentHeight
    const WORDS_PER_LINE_ROUGHLY = 35
    const ITEM_PAD = 15
    const SUBTITLE_HEIGHT = 18
    const LINE_HEIGHT = 16
    const TITLE_LINE_HEIGHT = LINE_HEIGHT * 2.2
    const TITLE_HEIGHT = Math.min(
      Math.ceil((result.title || '').length / 25) * TITLE_LINE_HEIGHT,
      TITLE_LINE_HEIGHT * 2,
    )
    const itemHeight =
      ITEM_PAD * 2 +
      TITLE_HEIGHT +
      SUBTITLE_HEIGHT +
      LINE_HEIGHT *
        Math.ceil((result.body || '').length / WORDS_PER_LINE_ROUGHLY)
    const itemHeightContain = Math.min(orbitHeight, itemHeight)
    const MAX_PER_SCREEN = 4
    const wantsToShow = Math.min(total, Math.round(orbitHeight / 300))
    const height = Math.min(
      itemHeightContain,
      Math.round(
        Math.max(orbitHeight / MAX_PER_SCREEN, orbitHeight / wantsToShow),
      ),
    )
    const background = isSelected ? theme.highlight.color : 'transparent'
    return (
      <orbitItem
        css={{
          padding: padding || ITEM_PAD,
          background,
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
        <OrbitItemPreview
          if={!hidePreview}
          result={result}
          background={background}
        />
      </orbitItem>
    )
  }

  static style = {
    orbitItem: {
      position: 'relative',
      // background: 'red',
      overflow: 'hidden',
      '&:hover bg': {
        opacity: 1,
      },
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
}
