import copy from 'copy-to-clipboard'
import * as React from 'react'

type Props = {
  text: string
  children?: React.ReactNode
  onClick?: () => void
  onCopy: () => void
}

export class CopyToClipboard extends React.Component<Props> {
  onClick = (ev: React.PointerEvent) => {
    const { text, onCopy, children } = this.props
    const elem = React.Children.only(children)
    copy(text)

    if (onCopy) onCopy()

    // @ts-ignore
    if (elem && elem.props && typeof elem.props.onClick === 'function') {
      // @ts-ignore
      elem.props.onClick(ev)
    }
  }

  render() {
    const { text: _text, onCopy: _onCopy, children, ...rest } = this.props
    const elem = React.Children.only(children)
    // @ts-ignore
    return React.cloneElement(elem, { ...rest, onClick: this.onClick })
  }
}
