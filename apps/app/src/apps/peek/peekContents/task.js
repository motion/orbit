import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../index'
import { PeekRelatedStore } from './PeekRelatedStore'
import { RelatedPeople } from './RelatedPeople'

const BodyContents = view({
  whiteSpace: 'pre-line',
  padding: 20,
  fontSize: 16,
  lineHeight: '1.5rem',
  overflow: 'hidden',
})

@view.attach({
  relatedStore: PeekRelatedStore,
})
@view
export class Task extends React.Component {
  render() {
    const { relatedStore, bit, appStore, children } = this.props
    if (!bit) {
      return children({})
    }
    return (
      <PeekBitResolver appStore={appStore} bit={bit}>
        {({ title, location, content, comments, icon, permalink }) => {
          return children({
            title,
            subtitle: location,
            icon,
            permalink,
            content: (
              <>
                hey you2
                <RelatedPeople relatedStore={relatedStore} />
                <BodyContents
                  className="markdown"
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
                <BodyContents>{comments}</BodyContents>
                <br />
                <br />
              </>
            ),
          })
        }}
      </PeekBitResolver>
    )
  }
}
