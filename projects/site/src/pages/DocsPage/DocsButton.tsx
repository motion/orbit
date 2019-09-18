import { Button, Col, MenuButton, RoundButton, Row, SubSection, SurfacePassProps } from '@o/ui'
import React, { useState } from 'react'

export let Basic = () => {
  const [full, setFull] = useState(false)
  return (
    <Col space>
      <Row space flexWrap="wrap">
        <Button>Hello World</Button>
        <Button icon="cog">Hello World</Button>
        <Button icon="cog" iconAfter>
          Hello World
        </Button>
      </Row>

      <Row>
        <Button
          layoutTransition={{
            duration: 0.5,
          }}
          icon={full ? 'chevron-left' : 'chevron-right'}
          onClick={() => setFull(!full)}
        >
          {full ? 'Long title' : ''}
        </Button>
      </Row>
    </Col>
  )
}

export let Coats = (
  <Col space>
    <Row space flexWrap="wrap">
      {['error', 'warn', 'confirm', 'bordered', 'selected', 'flat', 'clear'].map(alt => (
        <Button key={alt} coat={alt} icon="cog" iconAfter>
          Alt {alt}
        </Button>
      ))}
    </Row>
    <Row space flexWrap="wrap">
      {['error', 'warn', 'confirm'].map(alt => (
        <RoundButton key={alt} coat={alt} icon="cog" size="lg">
          Alt {alt}
        </RoundButton>
      ))}
    </Row>
    <Row space flexWrap="wrap">
      {['error', 'warn', 'confirm'].map(alt => (
        <Button key={alt} coat={alt} icon="cog" size="lg" sizePadding={1.2} sizeRadius={1.2}>
          Alt {alt}
        </Button>
      ))}
    </Row>
    <Row space flexWrap="wrap">
      {['error', 'warn', 'confirm'].map(alt => (
        <Button key={alt} coat={alt} icon="cog" size="xxxl">
          Alt {alt}
        </Button>
      ))}
    </Row>
    <Row space flexWrap="wrap">
      {['error', 'warn', 'confirm'].map(alt => (
        <Button key={alt} coat={alt} icon="cog" size="xxxl" circular />
      ))}
    </Row>
  </Col>
)

export let MenuButtonExample = (
  <Row space flexWrap="wrap">
    <MenuButton
      coat="action"
      icon="cog"
      items={[
        {
          title: 'Item one',
          onClick: () => alert('hi'),
        },
      ]}
    >
      Slim menu
    </MenuButton>
    <MenuButton
      items={[
        {
          title: 'Item One',
          subTitle: 'Lorem ipsum dolor.',
          icon: 'cog',
        },
        {
          title: 'Item Two',
          subTitle: 'Lorem ipsum dolor.',
          icon: 'moon',
        },
      ]}
    >
      Larger menu
    </MenuButton>
  </Row>
)

export let Sizing = (
  <Col space>
    <Row space flexWrap="wrap">
      {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => (
        <Button key={size} size={size} icon="cog" iconAfter>
          Size {size}
        </Button>
      ))}
    </Row>
    <Row space flexWrap="wrap">
      {[1, 2, 3, 4].map(size => (
        <Button key={size} size={size} icon="cog" iconAfter>
          Size {size}
        </Button>
      ))}
    </Row>
  </Col>
)

export let Elevation = (
  <Row space flexWrap="wrap">
    {[2, 3, 4, 5].map(i => (
      <SubSection title={`Elevation ${i}, Size ${i}`} key={i}>
        <Button key={i} size={i} elevation={i} icon="cog" iconAfter>
          {i}
        </Button>
      </SubSection>
    ))}
  </Row>
)

export let Group = (
  <Row group>
    <Button>Hello</Button>
    <Button>World</Button>
  </Row>
)

export let PassMultipleProps = (
  <SurfacePassProps icon="home" coat="action" size="lg">
    <Row space>
      <Button>Hello</Button>
      <Button>World</Button>
    </Row>
  </SurfacePassProps>
)

export let SizingProps = (
  <Button size={2} sizePadding={3} sizeRadius={3} sizeHeight={2} sizeIcon={0.75} icon="home">
    Hello
  </Button>
)
