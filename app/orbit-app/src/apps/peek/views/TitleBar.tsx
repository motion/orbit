import { view } from '@mcro/black'
import { Text } from '@mcro/ui'

// just the top titlebar:
export const TitleBar = ({ children, after, ...props }) => (
  <TitleBarContain {...props}>
    <TitleBarText>{children}</TitleBarText>
    {after}
  </TitleBarContain>
)

const TitleBarContain = view({
  flex: 1,
  height: 27,
  maxWidth: '100%',
  position: 'relative',
  zIndex: 1,
})

const TitleBarText = props => (
  <Text
    size={1}
    fontWeight={700}
    ellipse={1}
    margin={0}
    padding={[3, 80]}
    lineHeight="1.5rem"
    textAlign="center"
    {...props}
  />
)
