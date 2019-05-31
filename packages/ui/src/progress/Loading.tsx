import React from 'react'

import { Center } from '../Center'
import { Spinner } from '../Spinner'
import { SimpleText } from '../text/SimpleText'
import { Col } from '../View/Col'

export type LoadingProps = { message?: string }

export function Loading(props: LoadingProps) {
  return (
    <Center>
      <Col space>
        <Spinner />
        {!!props.message && <SimpleText>{props.message}</SimpleText>}
      </Col>
    </Center>
  )
}
