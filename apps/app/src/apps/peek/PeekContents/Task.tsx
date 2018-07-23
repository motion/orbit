import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../index'
import { PeekRelatedStore } from './PeekRelatedStore'
import { RelatedPeople } from './RelatedPeople'
import { PeekContentProps } from './PeekContentProps'

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
export class Task extends React.Component<
  PeekContentProps & {
    relatedStore: PeekRelatedStore
  }
> {
  render() {
    const { relatedStore, bit, appStore, children } = this.props
    if (!bit) {
      return children({})
    }
    return (
      <PeekBitResolver appStore={appStore} bit={bit}>
        {({ title, date, location, content, comments, icon, permalink }) => {
          return children({
            title,
            subtitle: location,
            icon,
            date,
            permalink,
            content: (
              <>
                {/* <RelatedPeople title="Assigned" relatedStore={relatedStore} /> */}
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
