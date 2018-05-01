import * as UI from '@mcro/ui'

export const RoundButton = props => (
  <UI.Button
    sizeRadius={2}
    sizeHeight={0.8}
    sizePadding={1.1}
    borderWidth={0}
    inline
    margin={[-2, -4]}
    backgroundAlpha={0.3}
    {...props}
  />
)
