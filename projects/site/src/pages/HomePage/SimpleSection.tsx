import { isDefined } from '@o/kit'
import { Col, gloss, Icon, Row } from '@o/ui'
import React from 'react'
import { Paragraph } from '../../views/Paragraph'
import { TitleText } from '../../views/TitleText'

export const SimpleSection = props => (
  <SectionChrome space>
    <SectionTitle>
      {isDefined(props.index) && (
        <Badge>
          <BadgeText>{props.index}.</BadgeText>
        </Badge>
      )}
      <TitleText textAlign="left" flex={1}>
        {props.title}
      </TitleText>
    </SectionTitle>
    <SectionBody>{props.children}</SectionBody>
  </SectionChrome>
)
const SectionChrome = gloss(Col, {
  position: 'relative',
})

export const SectionP = gloss(
  props => <Paragraph size={1.1} alpha={0.65} sizeLineHeight={1.15} {...props} />,
  {
    display: 'block',
    float: 'left',
  },
)

const SectionBody = gloss({
  display: 'block',
})

export const SectionIcon = gloss(props => <Icon size={52} {...props} />, {
  float: 'right',
  margin: [8, 0, 16, 16],
})

const SectionTitle = gloss(Row, {
  flex: 1,
  alignItems: 'flex-end',
})

const Badge = gloss({
  position: 'absolute',
  // top: -50,
  transform: {
    x: 'calc(-100% - 15px)',
  },
  width: 50,
  height: 50,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
}).theme((_, theme) => ({
  color: theme.color,
  border: [1, theme.color.alpha(0.25)],
}))

const BadgeText = gloss({
  transform: {
    y: '15%',
    x: '55%',
  },
})
