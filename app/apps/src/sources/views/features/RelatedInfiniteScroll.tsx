import { Divider, SubTitle, VerticalSpace } from '@mcro/ui'
import * as React from 'react'

export const RelatedInfiniteScroll = ({ store }) => {
  return (
    <>
      {!!store.nextConversations.length && (
        <>
          <Divider />
          <SubTitle>Related & nearby</SubTitle>
          <VerticalSpace small />
        </>
      )}
      {store.nextConversations.map((convo, index) => (
        <React.Fragment key={`${convo.id}${index}`}>
          {convo}
          {index !== store.nextConversations.length - 1 && <Divider />}
        </React.Fragment>
      ))}
      <VerticalSpace />
      <VerticalSpace />
    </>
  )
}
