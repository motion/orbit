import { view } from '~/helpers'
import { Icon } from '~/ui'

@view.attach('layoutStore')
@view
export default class ToggleSidebar {
  render({ layoutStore, ...props }) {
    return (
      <Icon
        $icon
        onClick={layoutStore.sidebar.toggle}
        name={layoutStore.sidebar.active ? 'arrow-min-right' : 'arrow-min-left'}
        color={[255, 255, 255, 0.2]}
        hoverColor={[255, 255, 255, 0.8]}
        size={14}
        padding={5}
        {...props}
      />
    )
  }

  static style = {
    icon: {
      transform: {
        z: 0,
      },
    },
  }
}
