// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { List } from './list'
import { Button } from './button'
import { Popover } from './popover'
import { Arrow } from './arrow'

// export type Props = {
//   children: React$Element<any> | string,
//   onChange?: Function,
//   color?: Color,
//   width?: number,
//   items?: Array<string>,
//   popoverProps?: Object,
//   noWrap?: boolean,
// }

@view.ui
export class Dropdown extends React.Component {
  static defaultProps = {
    width: 100,
  }

  render({
    color,
    children,
    onChange,
    width,
    items,
    popoverProps,
    buttonProps,
    theme,
    noWrap,
    ...props
  }) {
    const arrow = (
      <icon $arrow>
        <Arrow color="#000" size={8} />
      </icon>
    )

    return (
      <dropdown>
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
      </dropdown>
    )
  }

  static style = {
    target: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    icon: {
      marginLeft: 5,
    },
    arrow: {
      transform: {
        y: 1,
      },
    },
  }
}
