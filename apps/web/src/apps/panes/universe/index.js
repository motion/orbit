import { view } from '@mcro/black'
import * as Pane from '~/apps/panes/pane'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { Thing } from '~/app'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryBar,
} from 'victory'
import {
  last,
  sortBy,
  orderBy,
  take,
  uniqBy,
  range,
  flatten,
  groupBy,
  includes,
} from 'lodash'
import moment from 'moment'
import Multiselect from '../views/multiselect'
import { fuzzy } from '~/helpers'
import tfidf from './tfidf'

const thingStamp = thing => +new Date(thing.data.createdAt)

const weeks = stamps => {
  const groups = groupBy(
    stamps,
    stamp => +new Date(moment(+new Date(stamp)).startOf('isoWeek'))
  )

  return sortBy(Object.keys(groups)).map(stamp => ({
    x: new Date(+stamp),
    y: groups[stamp].length,
  }))
}

@view
class SelectItem {
  render({ key, icon, isActive, index, isHighlight, text }) {
    return (
      <UI.Theme name="light">
        <item
          key={key}
          $first={index === 0}
          $isActive={isActive}
          $isHighlight={isHighlight}
          $$row
        >
          <left $$row>
            <check $activeIcon $opaque={isActive}>
              <UI.Icon color="#333" size={14} $icon name="check" />
            </check>
            {icon}
            <UI.Text $name>{text}</UI.Text>
          </left>
          <x $activeIcon $opaque={isActive}>
            <UI.Icon color="#333" size={14} $icon name="remove" />
          </x>
        </item>
      </UI.Theme>
    )
  }
  static style = {
    item: {
      width: '100%',
      borderTop: '1px solid #e8e8e8',
      padding: [12, 20],
      flex: 1,
      alignItems: 'center',
      fontWeight: 600,
      justifyContent: 'space-between',
      transition: 'background 80ms ease-in',
      fontSize: 16,
    },
    left: {
      alignItems: 'center',
    },
    check: {
      width: 30,
    },
    icon: {
      opacity: 0.6,
    },
    activeIcon: {
      opacity: 0,
      transform: { scale: 0 },
      transformOrigin: '20% 50%',
      transition: 'all 80ms ease-in',
    },
    opaque: {
      opacity: 1,
      transform: { scale: 1 },
    },
    x: {
      width: 30,
      marginLeft: 30,
    },
    name: {
      marginLeft: 10,
    },
    isActive: {
      opacity: 0.7,
      background: '#f2f2f2',
    },
    isHighlight: {
      color: '#000',
      opacity: 0.9,

      background: '#eee',
    },
  }
}

@view
export class AssignAction {
  render({ store, onClose }) {
    return (
      <Assign
        activeIds={store.assigned}
        onClose={onClose}
        store={store}
        onChange={store.setAssigned}
      />
    )
  }
}

@view
class Chart {
  render({ store }) {
    const things = store.activeThings
    if (things.length === 0) return <div />
    const start = thingStamp(things[0])
    const end = thingStamp(last(things))
    const steps = 5
    const step = (end - start) / steps
    const times = range(steps).map(i => new Date(start + step * i))
    const chartStyle = { parent: { minWidth: '80%' } }
    const values = weeks(things.map(thingStamp))

    return (
      <chart>
        <VictoryChart
          width={620}
          height={400}
          scale={{ x: 'time' }}
          style={chartStyle}
          containerComponent={
            <VictoryZoomContainer
              responsive={true}
              dimension="x"
              zoomDomain={store.zoomDomain}
              onDomainChange={dom => (store.selectedDomain = dom)}
            />
          }
        >
          <VictoryBar
            style={{
              data: { fill: '#75a9f3' },
            }}
            data={values}
          />
        </VictoryChart>
        <VictoryChart
          padding={{ top: 0, left: 0, right: 50, bottom: 30 }}
          width={620}
          height={120}
          scale={{ x: 'time' }}
          style={chartStyle}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              dimension="x"
              selectedDomain={store.selectedDomain}
              onDomainChange={dom => (store.zoomDomain = dom)}
            />
          }
        >
          <VictoryAxis
            tickValues={times}
            tickFormat={x => moment(new Date(x)).format('MMM Do YY')}
          />
          <VictoryBar
            style={{
              data: { fill: '#75a9f3' },
            }}
            data={values}
          />
        </VictoryChart>
      </chart>
    )
  }
}

@view
class Assign {
  render({ onClose, store }) {
    return (
      <UI.Theme name="light">
        <multi>
          <Multiselect
            items={store.assignOptions}
            onClose={onClose}
            activeIds={store.assigned}
            onChange={ids => (store.assigned = ids)}
            renderItem={(item, { index, isActive, isHighlight }) => (
              <SelectItem
                key={item.id}
                text={item.id}
                isActive={isActive}
                isHighlight={isHighlight}
                index={index}
                icon={<img src={`/images/${item.id}.jpg`} $avatar />}
              />
            )}
          />
        </multi>
      </UI.Theme>
    )
  }

  static style = {
    avatar: {
      borderRadius: 100,
      width: 24,
      height: 24,
    },
  }
}

@view.attach('millerStore')
@view
class Header {
  render({ millerStore, store }) {
    return (
      <header>
        <top $$row>
          <left>
            <UI.Title size={2}>Universe</UI.Title>
          </left>
          <mid>
            <UI.Input
              onChange={e => (store.search = e.target.value)}
              value={store.search}
            />
          </mid>
          <UI.Button
            onClick={() => {
              millerStore.runAction('assign')
            }}
            className="target-assign"
            $button
          >
            Author
          </UI.Button>
        </top>
        <Chart store={store} />
      </header>
    )
  }

  static style = {
    top: {
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      marginRight: 20,
    },
  }
}

@view
class ThingView {
  render({ title, data, ...props }) {
    return (
      <thing>
        <UI.Title size={1.2}>{title}</UI.Title>
        <UI.Text>
          created on {moment(new Date(data.createdAt)).format('MMM Do')} by{' '}
          {data.author.login}
        </UI.Text>
      </thing>
    )
  }
}

@view({
  store: class UniverseStore {
    things = Thing.find()
    selectedDomain = null
    zoomDomain = null
    search = ''

    assigned = []
    assignOptions = [
      { id: 'ncammarata' },
      { id: 'steelbrain' },
      { id: 'natew' },
    ]

    idToWords = {}

    get importantWords() {
      if ((this.things || []).length === 0) return []

      return take(
        tfidf(this.things.map(i => i.title), this.listThings.map(i => i.title)),
        7
      )
      // .map(x => x.name)
      // .join(', ')
    }

    get listThings() {
      return this.zoomDomain
        ? this.activeThings.filter(t => {
            const stamp = thingStamp(t)

            return (
              stamp > +this.zoomDomain.x[0] && stamp < +this.zoomDomain.x[1]
            )
          })
        : this.activeThings
    }

    get activeThings() {
      let active = this.things || []

      if (this.assigned.length !== 0) {
        active = active.filter(t =>
          includes(this.assigned, t.data.author.login)
        )
      }

      if (this.search !== '') {
        active = fuzzy(active, this.search)
      }

      return active
    }
  },
})
export default class Universe {
  render({ store }) {
    const thingViews = store.listThings.map(t => ({
      view: () => <ThingView {...t} />,
    }))

    const actions = [
      {
        name: 'assign',
        popover: props => <AssignAction store={store} {...props} />,
      },
    ]

    return (
      <Pane.Card
        actions={actions}
        items={[
          {
            view: () => <Header store={store} />,
          },
          {
            view: () => (
              <UI.Title>
                {store.listThings.length + ''} Issues {'           '}
                {store.importantWords.join(', ')}
              </UI.Title>
            ),
          },
          ...thingViews,
        ]}
      />
    )
  }
}
