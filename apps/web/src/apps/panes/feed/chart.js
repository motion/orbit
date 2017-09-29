import * as React from 'react'
import { view } from '@mcro/black'
import { groupBy, sortBy } from 'lodash'
import { VictoryChart, VictoryBrushContainer, VictoryBar } from 'victory'
import moment from 'moment'

const itemStamp = item => +new Date(item.data.createdAt || item.data.created_at)
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
export default class Chart {
  render({ store }) {
    return null

    const things = store.currentChart
    if (things.length === 0) {
      return <div />
    }
    const chartStyle = {
      border: '1px solid orange',
      background: 'red',
    }
    const values = weeks(things.map(itemStamp))
    return (
      <chart>
        <VictoryChart
          padding={{ top: 0, left: 0, right: 0, bottom: 20 }}
          width={600}
          height={60}
          scale={{ x: 'time' }}
          style={chartStyle}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              dimension="x"
              onDomainChange={store.setBrush}
            />
          }
        >
          <VictoryBar
            style={{
              data: { fill: '#7697ff' },
            }}
            data={values}
          />
        </VictoryChart>
      </chart>
    )
  }

  static style = {
    chart: {
      flex: 1,
      marginTop: 10,
    },
  }
}
