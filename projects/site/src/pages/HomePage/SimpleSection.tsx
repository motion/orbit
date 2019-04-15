import { isDefined } from '@o/kit'
import { Col, gloss, Icon, Row } from '@o/ui'
import React from 'react'
import { Paragraph } from '../../views/Paragraph'
import { TitleText } from '../../views/TitleText'

export const SimpleSection = ({ index = undefined, title, children, ...rest }) => (
  <SectionChrome space {...rest}>
    <SectionTitle>
      {isDefined(index) && (
        <Badge>
          <BadgeText>{index}.</BadgeText>
        </Badge>
      )}
      <TitleText size="sm" textAlign="left" flex={1}>
        {title}
      </TitleText>
    </SectionTitle>
    <SectionBody>{children}</SectionBody>
  </SectionChrome>
)
const SectionChrome = gloss(Col, {
  position: 'relative',
})

export const SectionP = gloss(
  props => <Paragraph size={1.25} alpha={0.65} sizeLineHeight={1.15} {...props} />,
  {
    display: 'block',
    float: 'left',
  },
)

const SectionBody = gloss({
  display: 'block',
})

export const SectionIcon = gloss(props => <Icon size={72} color="#000" {...props} />, {
  float: 'right',
  margin: [18, 0, 40, 40],
  opacity: 0.2,
})

const SectionTitle = gloss(Row, {
  flex: 1,
})

const Badge = gloss({
  position: 'absolute',
  // top: -50,
  transform: {
    x: 'calc(-100% - 15px)',
    y: -20,
  },
  width: 55,
  height: 55,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
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