import * as UI from '@mcro/ui'

export const RoundButton = props => (
  <UI.Button
    color={false}
    sizeRadius={2}
    sizeHeight={0.88}
    sizePadding={1.2}
    borderWidth={0}
    fontWeight={300}
    display="inline-flex"
    backgroundAlpha={0.4}
    {...props}
  />
)
