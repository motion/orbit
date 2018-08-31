import * as React from 'react'
import { view, react, compose, ensure } from '@mcro/black'
import { BitRepository, PersonBitRepository } from '../../../../repositories'
import { SubTitle, RoundButton } from '../../../../views'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import {
  SelectionStore,
  SelectionGroup,
} from '../../../../stores/SelectionStore'
import { capitalize } from 'lodash'
import { View, Row, Col } from '@mcro/ui'
import { SelectableCarousel } from '../../../../components/SelectableCarousel'
import { now } from 'mobx-utils'
import { RoundButtonSmall } from '../../../../views/RoundButtonSmall'

type Props = {
  name: string
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  homeStore?: OrbitHomeStore
}

const findManyType = integration =>
  BitRepository.find({
    take: 5,
    where: {
      integration,
    },
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
  })

class OrbitHomeStore {
  props: Props

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', isActive)
      this.props.selectionStore.setResults(this.results)
    },
  )

  get results() {
    let results: SelectionGroup[] = []
    for (const name in this.following) {
      results.push({ name, type: 'row', items: this.following[name].items })
    }
    return results
  }

  following = react(
    () => now(1000 * 60),
    async () => {
      const people = await PersonBitRepository.find({
        // order: { createdAt: 'DESC' },
        take: 15,
      })
      const [
        slack,
        gdrive,
        github,
        confluence,
        jira,
        gmail,
      ] = await Promise.all([
        findManyType('slack'),
        findManyType('gdrive'),
        findManyType('github'),
        findManyType('confluence'),
        findManyType('jira'),
        findManyType('gmail'),
      ])
      // only return ones with results
      const all = { people, slack, gdrive, github, confluence, jira, gmail }
      const res = {} as any
      let curIndex = 0
      for (const name in all) {
        if (all[name] && all[name].length) {
          const items = all[name]
          const startIndex = curIndex
          const endIndex = startIndex + items.length
          res[capitalize(name)] = { items, startIndex, endIndex }
          curIndex += items.length
        }
      }
      return res
    },
    {
      defaultValue: {},
      onlyUpdateIfChanged: true,
    },
  )
}

const Section = view()

const decorator = compose(
  view.attach('subPaneStore'),
  view,
)
const OrbitHomeCarouselSection = decorator(
  ({ subPaneStore, homeStore, categoryName, ...props }) => {
    const { items, startIndex } = homeStore.following[categoryName]
    const isPeople = categoryName === 'People'
    return (
      <Section key={categoryName}>
        <Row alignItems="center" padding={[10, 0, 2]}>
          <SubTitle margin={0} padding={0}>
            {categoryName}
          </SubTitle>
          <Col flex={1} />
          <RoundButtonSmall
            icon="remove"
            iconProps={{ size: 9 }}
            opacity={0}
            hoverStyle={{ opacity: 1 }}
          />
        </Row>
        <Unpad>
          <SelectableCarousel
            items={items}
            offset={startIndex}
            horizontalPadding={12}
            isActiveStore={subPaneStore}
            resetOnInactive
            cardProps={{
              hide: {
                body: !isPeople,
                icon: isPeople,
              },
              titleFlex: 1,
              titleProps: isPeople ? { ellipse: true } : null,
            }}
            {...props}
          />
        </Unpad>
      </Section>
    )
  },
)

const Unpad = view({
  margin: [0, -16],
})

@view.attach('searchStore', 'selectionStore', 'paneManagerStore')
@view.attach({
  homeStore: OrbitHomeStore,
})
@view
export class OrbitHome extends React.Component<Props> {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  render() {
    const { homeStore, selectionStore } = this.props
    console.log('HOME RENDER2')
    return (
      <SubPane name="home" fadeBottom>
        {/* <SuggestionBarVerticalPad /> */}
        {Object.keys(homeStore.following).map(categoryName => (
          <OrbitHomeCarouselSection
            key={categoryName}
            selectionStore={selectionStore}
            homeStore={homeStore}
            categoryName={categoryName}
            cardHeight={categoryName === 'People' ? 60 : 90}
          />
        ))}
        {/* this is a nice lip effect */}
        <View height={20} />
      </SubPane>
    )
  }
}
