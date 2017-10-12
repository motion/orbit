// @flow
import * as UI from '@mcro/ui'
import type { PaneResult } from '~/types'

const hasContent = (result: PaneResult) =>
  result && result.data && result.data.body

const getDate = (result: PaneResult) =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

export default function getItem(getActiveIndex) {
  return (result, index) => ({
    key: `${index}${result.id}`,
    highlight: () => index === getActiveIndex(),
    primary: result.title,
    primaryEllipse: !hasContent(result),
    children:
      result.display ||
      [
        result.data &&
          result.data.body && (
            <UI.Text key={0} lineHeight={20} opacity={0.5}>
              {getDate(result) + ' · '}
              {(result.data.body && result.data.body.slice(0, 120)) || ''}
            </UI.Text>
          ),
        !result.data &&
          getDate(result) && <UI.Text key={1}>{getDate(result)}</UI.Text>,
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
}
