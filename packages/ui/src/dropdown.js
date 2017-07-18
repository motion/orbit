// @flow
import React from 'react'
import { view } from '@mcro/black'
import List from './list'
import Button from './button'
import Popover from './popover'
import Arrow from './arrow'
import type { Color } from '@mcro/gloss'

export type Props = {
  children: React$Element<any> | string,
  onChange?: Function,
  color?: Color,
  width?: number,
  items?: Array<string>,
  popoverProps?: Object,
  noWrap?: boolean,
}

@view
export default class Dropdown {
  props: Props

  static defaultProps = {
    width: 100,
    color: [255, 255, 255, 0.5],
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
  }: Props) {
    return (
      <dropdown>
        <Popover
          openOnClick
          openOnHover
          closeOnEsc
          background
          theme={theme}
          borderRadius={6}
          elevation={3}
          arrowSize={12}
          distance={4}
          target={
            <target>
              {noWrap && children}
              <Button
                if={!noWrap}
                inline
                iconAfter
                icon={
                  <icon $arrow>
                    <Arrow theme="light" size={8} color={color} />
                  </icon>
                }
                $$color={color}
                {...buttonProps}
              >
                {children}
              </Button>
            </target>
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
      opacity: 0.4,
      '&:hover': {
        opacity: 1,
      },
    },
  }
}
