import * as React from 'react'
import { view } from '@mcro/black'
import { List } from './List'
import { Button } from './Button'
import { Popover } from './Popover'
import { Arrow } from './Arrow'
import { Color } from '@mcro/css'

type Props = {
  children: any
  onChange?: Function
  color?: Color
  width?: number
  items?: Array<string>
  popoverProps?: Object
  noWrap?: boolean
  buttonProps?: Object
}

@view.ui
export class Dropdown extends React.Component<Props> {
  static defaultProps = {
    width: 100,
  }

  render() {
    const {
      children,
      width,
      items,
      popoverProps,
      buttonProps,
      noWrap,
      ...props
    } = this.props
    const arrow = (
      <div>
        <Arrow color="#000" size={8} />
      </div>
    )

    return (
      <div>
        <Popover
          openOnClick
          openOnHover
          closeOnEsc
          background
          borderRadius={6}
          elevation={3}
          arrowSize={12}
          distance={4}
          target={
            <Button
              if={!noWrap}
              glow={false}
              iconAfter
              icon={arrow}
              borderRadius={16}
              {...buttonProps}
            >
              {children}
            </Button>
          }
          {...popoverProps}
        >
          <List
            controlled
            width={width}
            items={items}
            getItem={item => ({
              primary: item,
            })}
            {...props}
          />
        </Popover>
      </div>
    )
  }

  // style = {
  //   target: {
  //     flexFlow: 'row',
  //     alignItems: 'center',
  //   },
  //   icon: {
  //     marginLeft: 5,
  //   },
  //   arrow: {
  //     transform: {
  //       y: 1,
  //     },
  //   },
  // }
}
