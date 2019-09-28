import React, { memo } from 'react'

import { Center } from '../Center'
import { Space } from '../Space'
import { Spinner } from '../Spinner'
import { SimpleText } from '../text/SimpleText'

export type LoadingProps = { message?: string }

export const Loading = memo((props: LoadingProps) => {
  return (
    <Center>
      <Spinner />
      <Space />
      {!!props.message && <SimpleText>{props.message}</SimpleText>}
    </Center>
  )
})
