// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import type { PaneResult } from '~/types'
import Fade from '../views/fade'
import StackNavigator from '../views/stackNavigator'
import SidebarColumn from './sidebarColumn'

const MAIN_WIDTH = 250
const itemProps = {
  size: 1.14,
  glow: true,
  padding: [10, 12],
  iconAfter: true,
}

const getDate = (result: PaneResult) =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

const getItem = ({ paneStore, sidebarStore }) => (result, index) => ({
  key: `${index}${result.id}`,
  highlight: () => index === paneStore.activeIndex,
  //color: [255, 255, 255, 0.6],
  primary: result.title,
  primaryEllipse: !sidebarStore.hasContent(result),
  children: [
    result.data &&
      result.data.body && (
        <UI.Text key={0} lineHeight={20} opacity={0.5}>
          {getDate(result) + ' · '}
          {(result.data.body && result.data.body.slice(0, 120)) || ''}
        </UI.Text>
      ),
    !result.data && <UI.Text key={1}>{getDate(result)}</UI.Text>,
  ].filter(Boolean),
  iconAfter: result.iconAfter !== false,
  icon:
    result.data && result.data.image ? (
      <img
        style={{
          width: 20,
          height: 20,
          borderRadius: 1000,
          margin: 'auto',
        }}
        src={`/images/${result.data.image}`}
      />
    ) : (
      result.icon
    ),
})

@view.attach('homeStore')
@view
export default class Sidebar extends React.Component<Props> {
  render({ homeStore }: Props) {
    const width = MAIN_WIDTH
    return (
      <StackNavigator stack={homeStore.stack}>
        {({ data, index, currentIndex, navigate }) => (
          <Fade width={width} index={index} currentIndex={currentIndex}>
            <SidebarColumn
              data={data}
              navigate={navigate}
              paneProps={{
                primary: true,
                itemProps,
                width,
                groupKey: 'category',
                getItem: getItem(this.props),
              }}
            />
          </Fade>
        )}
      </StackNavigator>
    )
  }
}
