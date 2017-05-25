import { view } from '~/helpers'
import { Icon } from '~/ui'

@view.attach('layoutStore')
@view
export default class ToggleSidebar {
  render({ layoutStore, style, ...props }) {
    return (
      <Icon
        onClick={layoutStore.sidebar.toggle}
        name={layoutStore.sidebar.active ? 'min-right' : 'min-left'}
        color={[0, 0, 0]}
        hoverColor={[255, 255, 255, 0.8]}
        size={20}
        padding={5}
        style={{
          gloss: true,
          ...style,
          transform: {
            z: 0,
          },
        }}
        {...props}
      />
    )
  }
}
