import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import ColorBlock from './colorBlock'
import Multiselect from '../views/multiselect'

@view
class SelectItem {
  render({ key, icon, isActive, index, isHighlight, text }) {
    return (
      <UI.Theme name="light">
        <item
          key={key}
          $first={index === 0}
          $isActive={isActive}
          $isHighlight={isHighlight}
          $$row
        >
          <left $$row>
            <check $activeIcon $opaque={isActive}>
              <UI.Icon color="#333" size={14} $icon name="check" />
            </check>
            {icon}
            <UI.Text $name>{text}</UI.Text>
          </left>
          <x $activeIcon $opaque={isActive}>
            <UI.Icon color="#333" size={14} $icon name="remove" />
          </x>
        </item>
      </UI.Theme>
    )
  }
  static style = {
    item: {
      width: '100%',
      borderTop: '1px solid #e8e8e8',
      padding: [12, 20],
      flex: 1,
      alignItems: 'center',
      fontWeight: 600,
      justifyContent: 'space-between',
      transition: 'background 80ms ease-in',
      fontSize: 16,
    },
    left: {
      alignItems: 'center',
    },
    check: {
      width: 30,
    },
    icon: {
      opacity: 0.6,
    },
    activeIcon: {
      opacity: 0,
      transform: { scale: 0 },
      transformOrigin: '20% 50%',
      transition: 'all 80ms ease-in',
    },
    opaque: {
      opacity: 1,
      transform: { scale: 1 },
    },
    x: {
      width: 30,
      marginLeft: 30,
    },
    name: {
      marginLeft: 10,
    },
    isActive: {
      opacity: 0.7,
      background: '#f2f2f2',
    },
    isHighlight: {
      color: '#000',
      opacity: 0.9,

      background: '#eee',
    },
  }
}

@view
class Labels {
  render({ onChange, onClose, store, activeIds }) {
    return (
      <UI.Theme name="light">
        <multi>
          <Multiselect
            onClose={onClose}
            items={store.labelOptions}
            activeIds={activeIds}
            onChange={onChange}
            renderItem={(item, { index, isActive, isHighlight }) => (
              <SelectItem
                text={item.id}
                isActive={isActive}
                isHighlight={isHighlight}
                index={index}
                icon={<ColorBlock id={item.id} />}
              />
            )}
          />
        </multi>
      </UI.Theme>
    )
  }

  static style = {}
}

@view
class Assign {
  render({ onClose, onChange, store }) {
    return (
      <UI.Theme name="light">
        <multi>
          <Multiselect
            items={store.assignOptions}
            onClose={onClose}
            activeIds={store.assigned}
            onChange={onChange}
            renderItem={(item, { index, isActive, isHighlight }) => (
              <SelectItem
                key={item.id}
                text={item.id}
                isActive={isActive}
                isHighlight={isHighlight}
                index={index}
                icon={<img src={`/images/${item.id}.jpg`} $avatar />}
              />
            )}
          />
        </multi>
      </UI.Theme>
    )
  }

  static style = {
    avatar: {
      borderRadius: 100,
      width: 24,
      height: 24,
    },
  }
}

@view
export class LabelAction {
  render({ store, onClose }) {
    return (
      <Labels
        activeIds={store.labels}
        onClose={onClose}
        store={store}
        onChange={store.setLabels}
      />
    )
  }
}

@view
export class AssignAction {
  render({ store, onClose }) {
    return (
      <Assign
        activeIds={store.assigned}
        onClose={onClose}
        store={store}
        onChange={store.setAssigned}
      />
    )
  }
}
