import * as UI from '@mcro/ui'

export const RoundButton = props => (
  <UI.Button
    color={false}
    sizeRadius={2}
    sizeHeight={0.8}
    sizePadding={1.1}
    borderWidth={0}
    fontWeight={300}
    inline
    backgroundAlpha={0.3}
    {...props}
  />
)
