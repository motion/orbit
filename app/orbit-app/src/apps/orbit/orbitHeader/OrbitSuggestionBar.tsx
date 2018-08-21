import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SearchFilterStore } from '../../../stores/SearchFilterStore'
import { PaneManagerStore } from '../PaneManagerStore'

const dateBg = UI.color('#ffb049')

const activeThemes = {
  date: {
    borderColor: dateBg.alpha(0.5),
    color: '#fff',
  },
  integration: {
    borderColor: 'rgba(71, 189, 36, 0.5)',
    color: '#fff',
  },
  person: {
    borderColor: '#8279ff',
    color: '#fff',
  },
  type: {
    borderColor: 'rgba(193, 255, 143)',
    color: '#fff',
  },
}

const SuggestionBar = view(UI.Row, {
  position: 'relative',
  // above subpane
  zIndex: 10,
  padding: [0, 15, 0],
  // have this take up no height because it lets us not have an awkward gap when this is not visible
  height: 0,
  transition: 'all ease 90ms 40ms',
  opacity: 0,
  transform: {
    x: 6,
  },
  visible: {
    opacity: 1,
    transform: {
      x: 0,
    },
  },
})

const HorizontalScroll = view({
  height: 28,
  overflowX: 'scroll',
  flex: 1,
  flexFlow: 'row',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

const suggestionTheme = theme => ({
  ...theme,
  background: theme.background.alpha(0.2),
  color: theme.color.alpha(0.6),
  backgroundHover: theme.backgroundHover.alpha(0.1),
})

const SuggestionButton = props => (
  <UI.Button
    glint={false}
    size={1}
    sizeRadius={0.9}
    marginRight={3}
    sizeHeight={0.8}
    sizePadding={0.6}
    fontWeight={600}
    themeAdjust={suggestionTheme}
    {...props}
  />
)

const SuggestionBarFade = view({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: '14%',
  zIndex: 1000,
  pointerEvents: 'none',
})

// SuggestionBarFade.theme = ({ theme }) => ({
//   background: `linear-gradient(to right, transparent, ${
//     themease.background
//   } 80%)`,
// })

type Props = {
  filterStore?: SearchFilterStore
  paneManagerStore: PaneManagerStore
}

const opacityScale = [1, 0.9, 0.8, 0.7, 0.5]

const hideFilterPanes = {
  settings: true,
  onboard: true,
  directory: true,
  apps: true,
}

export const OrbitSuggestionBar = view(
  ({ filterStore, paneManagerStore }: Props) => {
    filterStore.disabledFilters
    return (
      <SuggestionBar
        visible={hideFilterPanes[paneManagerStore.activePane] ? false : true}
      >
        <HorizontalScroll>
          {filterStore.allFilters.map((filter, index) => (
            <SuggestionButton
              key={`${filter.text}${filter.active}`}
              onClick={() => filterStore.toggleFilterActive(filter.text)}
              opacity={opacityScale[index] || 0.333}
              background="transparent"
              borderColor={
                (filter.active && activeThemes[filter.type].borderColor) ||
                'transparent'
              }
              borderWidth={1}
            >
              {filter.text}
            </SuggestionButton>
          ))}
          <UI.View width={50} />
        </HorizontalScroll>
        <SuggestionBarFade />
      </SuggestionBar>
    )
  },
)
