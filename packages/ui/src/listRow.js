import * as React from 'react'
import { view } from '@mcro/black'
import { Button } from './button'
import { Surface } from './surface'
import { UIContext } from './helpers/contexts'

// type Props = {
//   active?: number,
//   defaultActive?: number,
//   controlled?: boolean,
//   items: Array<React.Element<any> | Object>,
//   children: React.Element<any>,
//   label: React.Element<any>,
//   onChange?: Function,
//   onlyIcons?: boolean,
//   stretch?: boolean,
//   sync?: { get(): number, set(value: number): void },
//   color: Color,
//   uiContext?: Object,
//   itemProps?: Object,
//   spaced?: boolean,
// }

@view.ui
export class ListRow extends React.Component {
  state = {
    active: null,
  }

  select = active => {
    this.setState({ active })
    if (this.props.sync) {
      this.props.sync.set(active)
    }
  }

  get active() {
    const hasState = this.state.active !== null
    if (this.props.sync) {
      return this.props.sync.get()
    }
    return hasState ? this.state.active : this.props.defaultActive
  }

  render({
    items,
    controlled,
    onChange,
    defaultActive,
    onlyIcons,
    children: children_,
    active,
    label,
    stretch,
    sync,
    uiContext,
    color,
    itemProps: itemProps_,
    spaced,
    theme,
    ...props
  }) {
    let itemProps = itemProps_
    let children = children_
    const ACTIVE = typeof active === 'undefined' ? this.active : active
    const getContext = (index, length) =>
      spaced
        ? {}
        : {
            uiContext: {
              ...uiContext,
              inSegment: {
                first: index === 0,
                last: index === length - 1,
                index,
              },
            },
          }

    if (spaced) {
      itemProps = itemProps || {}
      itemProps.marginLeft = typeof props.spaced === 'number' ? spaced : 5
    }

    if (stretch) {
      itemProps = itemProps || {}
      itemProps.flex = 1
    }

    if (children) {
      const realChildren = React.Children.map(children, _ => _).filter(Boolean)

      children = realChildren
        .map((child, index) => {
          if (!child) {
            return false
          }
          const finalChild =
            typeof child === 'string' ? <span>{child}</span> : child

          return (
            <UIContext.Provider
              key={index}
              value={getContext(index, realChildren.length)}
            >
              {itemProps
                ? React.cloneElement(finalChild, {
                    ...itemProps,
                    ...finalChild.props,
                  }) /* merge child props so they can override */
                : finalChild}
            </UIContext.Provider>
          )
        })
        .filter(Boolean)
    } else if (Array.isArray(items)) {
      children = items.map((seg, index) => {
        const { text, id, icon, ...segmentProps } =
          typeof seg === 'object' ? seg : { text: seg, id: seg }
        if (segmentProps.flex) {
          return <div $$flex={segmentProps.flex} />
        }
        return (
          <Provider key={index} provide={getContext(index, items.length)}>
            <Button
              active={(id || icon) === ACTIVE}
              icon={onlyIcons ? text : icon}
              iconColor={color}
              onChange={() => {
                this.select(id)
                if (controlled && onChange) {
                  onChange(seg)
                }
              }}
              {...segmentProps}
              {...itemProps}
            >
              {(!onlyIcons && text) || segmentProps.children}
            </Button>
          </Provider>
        )
      })
    }

    return (
      <Surface
        tagName="row"
        noElement
        noWrap
        background="transparent"
        $row
        {...props}
      >
        <label if={label}>{label}</label>
        {children}
      </Surface>
    )
  }

  static style = {
    row: {
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
    },
    label: {
      margin: ['auto', 5],
      opacity: 0.8,
      fontSize: 11,
    },
  }

  static theme = props => ({
    row: {
      flex: props.flex || props.stretch === true ? 1 : props.flex,
      ...(props.reverse && {
        flexFlow: 'row-reverse',
      }),
      ...(props.column && {
        flexFlow: 'column',
      }),
    },
  })
}
