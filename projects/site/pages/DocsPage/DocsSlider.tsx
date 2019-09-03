import { Button, Center, Col, Row, Slider, SubTitle } from '@o/ui'
import React, { useState } from 'react'

export let Basic = () => {
  const [frame, setFrame] = useState(0)
  return (
    <Col height={600} space>
      <Row group>
        <Button flex={1} onClick={() => setFrame(frame - 1)}>
          Prev
        </Button>
        <Button flex={1} onClick={() => setFrame(frame + 1)}>
          Next
        </Button>
      </Row>
      <Slider curFrame={frame}>
        <Slider.Pane>
          <Center background="#ffcccc">
            <SubTitle>Pane 1</SubTitle>
          </Center>
        </Slider.Pane>
        <Slider.Pane>
          <Center background="#ccffff">
            <SubTitle>Pane 2</SubTitle>
          </Center>
        </Slider.Pane>
        <Slider.Pane>
          <Center background="#ffccff">
            <SubTitle>Pane 3</SubTitle>
          </Center>
        </Slider.Pane>
      </Slider>
    </Col>
  )
}
