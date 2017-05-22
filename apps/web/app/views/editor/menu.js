import React from 'react'
import Portal from 'react-portal'
import { view } from '~/helpers'

@view class Button {
  render({ onClick, mark, icon }) {
    const isActive = true //this.hasMark(type)
    const style = {
      marginLeft: 8,
      marginRight: 8,
      cursor: 'pointer',
      color: '#eee',
      fontWeight: 600,
      fontSize: 16,
      alignSelf: 'center',
      opacity: 0.7,
    }
    return (
      <span
        style={style}
        className="button"
        onMouseDown={onMark}
        data-active={isActive}
      >
        <span>{icon}</span>
      </span>
    )
  }
}

@view
export default class Menu {
  componentDidUpdate() {
    this.props.onUpdate()
  }

  render({ onOpen, onMark }) {
    // basically stolen from paper
    const style = {
      flexFlow: 'row',
      background: '#1b2733',
      boxShadow: '0 0 0 1px #000, 0 8px 16px rgba(27,39,51,0.16)',
      borderRadius: 5,
      height: 30,
      padding: 5,
    }

    const marks = [
      { mark: 'bold', icon: 'B' },
      { mark: 'italic', icon: 'I' },
      { mark: 'underlined', icon: 'U' },
      { mark: 'code', icon: '</>' },
    ]

    return (
      <Portal isOpened onOpen={onOpen}>
        <div className="menu hover-menu">
          <div style={style}>
            {marks.map(({ mark, icon }) => (
              <Button
                onClick={() => onMark(mark)}
                key={mark}
                mark={mark}
                icon={icon}
              />
            ))}
          </div>
        </div>
      </Portal>
    )
  }

  static style = {}
}
