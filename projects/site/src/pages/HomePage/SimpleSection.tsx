import { Col, gloss, Icon, Row, Space, View } from '@o/ui'
import { isDefined } from '@o/utils'
import React from 'react'

import { useScreenSize } from '../../hooks/useScreenSize'
import { FadeChild, fadeLeftProps, fadeRightProps } from '../../views/FadeIn'
import { Paragraph } from '../../views/Paragraph'
import { TitleText } from '../../views/TitleText'

const titleFont = {
  WebkitTextFillColor: 'transparent',
  background: 'linear-gradient(to right, #B65138, #BE0DBE)',
  backgroundSize: '300',
}

export const SimpleSection = ({ delay = 100, index = undefined, title, children, ...rest }) => {
  const screen = useScreenSize()
  const isLeft = isDefined(index) && index % 2 === 0
  return (
    <SectionChrome space {...rest}>
      <FadeChild {...(isLeft ? fadeRightProps : fadeLeftProps)} delay={delay}>
        <SectionTitle>
          {isDefined(index) && (
            <Badge opacity={screen === 'large' ? 1 : 0}>
              <BadgeText>{index}.</BadgeText>
            </Badge>
          )}
          <TitleText
            style={{
              WebkitBackgroundClip: 'text',
            }}
            {...titleFont}
            size={1.1}
            sizeLineHeight={1.2}
            textAlign="left"
            flex={1}
            fontWeight={200}
          >
            {title}
          </TitleText>
        </SectionTitle>
        <Space />
        <SectionBody>{children}</SectionBody>
      </FadeChild>
    </SectionChrome>
  )
}

const SectionChrome = gloss(Col, {
  position: 'relative',
})

export const SectionP = gloss(
  props => <Paragraph tagName="div" size={1.15} alpha={0.75} sizeLineHeight={1.25} {...props} />,
  {
    display: 'block',
    float: 'left',
  },
)

const SectionBody = gloss({
  display: 'block',
})

export const SectionIcon = gloss(props => <Icon size={42} {...props} />, {
  float: 'right',
  margin: [18, 0, 40, 40],
  // opacity: 0.2,
})

const SectionTitle = gloss(Row, {
  flex: 1,
  maxWidth: '80%',
})

const Badge = gloss(View, {
  position: 'absolute',
  // top: -50,
  transform: {
    x: 'calc(-100% - 15px)',
    y: -18,
  },
  width: 55,
  height: 55,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
}).theme((_, theme) => ({
  color: theme.color.setAlpha(0.5),
  // border: [1, theme.color.setAlpha(0.1)],
}))

const BadgeText = gloss({
  transform: {
    y: '15%',
    x: '55%',
  },
})
