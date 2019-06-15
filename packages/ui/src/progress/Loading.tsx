import React, { memo } from 'react'

import { Center } from '../Center'
import { Spinner } from '../Spinner'
import { SimpleText } from '../text/SimpleText'
import { Col } from '../View/Col'

export type LoadingProps = { message?: string }

export const Loading = memo((props: LoadingProps) => {
  return (
    <Center>
      <Col space>
        <Spinner />
        {!!props.message && <SimpleText>{props.message}</SimpleText>}
      </Col>
    </Center>
  )
})
