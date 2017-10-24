import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class OraHeader {
  focused = false
  downAt = Date.now()

  onHeaderMouseDown = () => {
    this.downAt = Date.now()
  }

  onHeaderMouseUp = () => {
    if (Date.now() - this.downAt < 200) {
      this.focused = true
      this.setTimeout(() => {
        this.props.homeStore.inputRef.focus()
      })
    }
  }

  onHeaderBlur = () => {
    this.props.homeStore.focused = false
    this.focused = false
  }

  render({ homeStore }) {
    const { focused } = homeStore
    return (
      <header
        $focus={focused}
        onFocus={homeStore.ref('focused').setter(true)}
        onBlur={this.onHeaderBlur}
        onMouseDown={this.onHeaderMouseDown}
        onMouseUp={this.onHeaderMouseUp}
        $$draggable
      >
        <UI.Icon $searchIcon size={12} name="zoom" color={[255, 255, 255, 1]} />
        <UI.Input
          $searchInput
          $disabled={!this.focused}
          size={1}
          getRef={homeStore.onInputRef}
          borderRadius={0}
          onChange={homeStore.onSearchChange}
          value={homeStore.textboxVal}
          borderWidth={0}
          fontWeight={200}
          css={{
            fontWeight: 300,
            color: '#fff',
            fontSize: 20,
          }}
        />

        <buttons
          css={{
            position: 'absolute',
            top: 0,
            right: 10,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5,
          }}
        >
          <UI.Icon
            onClick={homeStore.hide}
            size={12}
            name="remove"
            color={[255, 255, 255, 1]}
          />
        </buttons>
      </header>
    )
  }

  static style = {
    header: {
      position: 'relative',
      opacity: 0.3,
      transform: 'scaleY(0.75)',
      margin: [-5, 0],
      transition: 'all ease-in 80ms',
      '& .icon': {
        transition: 'all ease-in 80ms',
        transform: 'scaleX(0.75)',
      },
      '& > .input': {
        transition: 'all ease-in 80ms',
        transform: 'scaleX(0.75)',
      },
      '&:hover': {
        background: [255, 255, 255, 0.05],
      },
    },
    focus: {
      margin: 0,
      opacity: 1,
      transform: 'scaleX(1)',
      '& .icon': {
        transform: 'scaleX(1)',
      },
      '& > .input': {
        transform: 'scaleX(1)',
      },
    },
    disabled: {
      pointerEvents: 'none',
    },
    searchIcon: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      alignItems: 'center',
      height: 'auto',
      left: 12,
    },
    searchInput: {
      position: 'relative',
      padding: [8, 25],
      paddingLeft: 36,
      borderBottom: [1, 'dotted', [255, 255, 255, 0.1]],
    },
  }
}
