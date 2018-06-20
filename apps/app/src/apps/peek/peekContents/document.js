import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver, PeekHeader, PeekContent } from '../index'

@view
export class Document extends React.Component {
  render({ bit, appStore }) {
    if (!bit) {
      return null
    }
    return (
      <PeekBitResolver bit={bit} appStore={appStore}>
        {({ title, icon }) => {
          return (
            <>
              <PeekHeader title={title} icon={icon} />
              <PeekContent>
                <bodyContents
                  dangerouslySetInnerHTML={{
                    __html: (bit.body || '').replace('\n', '<br />'),
                  }}
                />
              </PeekContent>
            </>
          )
        }}
      </PeekBitResolver>
    )
  }

  static style = {
    bodyContents: {
      whiteSpace: 'pre-line',
      width: '100%',
      overflow: 'hidden',
    },
  }
}
