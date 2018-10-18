import * as React from 'react'
import { Divider } from '../../../views/Divider'
import { VerticalSpace, SubTitle } from '../../../views'

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
