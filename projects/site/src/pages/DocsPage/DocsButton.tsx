import { Button, MenuButton, RoundButton, Stack, SubSection, SurfacePassProps } from '@o/ui'
import React, { useState } from 'react'

export let Basic = () => {
  const [full, setFull] = useState(false)
  return (
    <Stack space>
      <Stack direction="horizontal" space flexWrap="wrap">
        <Button debug>Hello World</Button>
        <Button icon="cog">Hello World</Button>
        <Button icon="cog" iconAfter>
          Hello World
        </Button>
      </Stack>

      <Stack direction="horizontal">
        <Button
          layoutTransition={{
            duration: 0.5,
          }}
          icon={full ? 'chevron-left' : 'chevron-right'}
          onClick={() => setFull(!full)}
        >
          {full ? 'Long title' : ''}
        </Button>
      </Stack>
    </Stack>
  )
}

export let Coats = (
  <Stack space>
    <Stack direction="horizontal" space flexWrap="wrap">
      {['error', 'warn', 'confirm', 'bordered', 'selected', 'flat', 'clear'].map(coat => (
        <Button key={coat} coat={coat} icon="cog" iconAfter>
          Coat {coat}
        </Button>
      ))}
    </Stack>
    <Stack direction="horizontal" space flexWrap="wrap">
      {['error', 'warn', 'confirm'].map(coat => (
        <RoundButton key={coat} coat={coat} icon="cog" size="lg">
          Coat {coat}
        </RoundButton>
      ))}
    </Stack>
    <Stack direction="horizontal" space flexWrap="wrap">
      {['error', 'warn', 'confirm'].map(coat => (
        <Button key={coat} coat={coat} icon="cog" size="lg" sizePadding={1.2} sizeRadius={1.2}>
          Coat {coat}
        </Button>
      ))}
    </Stack>
    <Stack direction="horizontal" space flexWrap="wrap">
      {['error', 'warn', 'confirm'].map(coat => (
        <Button key={coat} coat={coat} icon="cog" size="xxxl">
          Coat {coat}
        </Button>
      ))}
    </Stack>
    <Stack direction="horizontal" space flexWrap="wrap">
      {['error', 'warn', 'confirm'].map(coat => (
        <Button key={coat} coat={coat} icon="cog" size="xxxl" circular />
      ))}
    </Stack>
  </Stack>
)

export let MenuButtonExample = (
  <Stack direction="horizontal" space flexWrap="wrap">
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
  </Stack>
)

export let Sizing = (
  <Stack space>
    <Stack direction="horizontal" space flexWrap="wrap">
      {['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map(size => (
        <Button key={size} size={size} icon="cog" iconAfter>
          Size {size}
        </Button>
      ))}
    </Stack>
    <Stack direction="horizontal" space flexWrap="wrap">
      {[1, 2, 3, 4].map(size => (
        <Button key={size} size={size} icon="cog" iconAfter>
          Size {size}
        </Button>
      ))}
    </Stack>
  </Stack>
)

export let Elevation = (
  <Stack direction="horizontal" space flexWrap="wrap">
    {[2, 3, 4, 5].map(i => (
      <SubSection title={`Elevation ${i}, Size ${i}`} key={i}>
        <Button key={i} size={i} elevation={i} icon="cog" iconAfter>
          {i}
        </Button>
      </SubSection>
    ))}
  </Stack>
)

export let Group = (
  <Stack direction="horizontal" group>
    <Button>Hello</Button>
    <Button>World</Button>
  </Stack>
)

export let PassMultipleProps = (
  <SurfacePassProps icon="home" coat="action" size="lg">
    <Stack direction="horizontal" space>
      <Button>Hello</Button>
      <Button>World</Button>
    </Stack>
  </SurfacePassProps>
)

export let SizingProps = (
  <Button size={2} sizePadding={3} sizeRadius={3} sizeHeight={2} sizeIcon={0.75} icon="home">
    Hello
  </Button>
)
