import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

export * from './roundButton'

export const highlightColor = UI.color('#696549')

export const Row = view('section', {
  flexFlow: 'row',
  padding: [8, 0],
  alignItems: 'center',
})

export const InputRow = ({ label, type, value, onChange }) => (
  <Row>
    <label css={{ padding: [0, 4], fontWeight: 400 }}>{label}</label>
    <input
      css={{ fontSize: 14, padding: [5, 6], margin: ['auto', 8], flex: 1 }}
      value={value}
      onChange={e => onChange(e.target.value)}
      type={type}
    />{' '}
  </Row>
)

export const CheckBoxRow = ({
  name = `checkbox-${Math.random()}`,
  children,
  checked,
  onChange,
}) => (
  <Row>
    <input
      id={name}
      name={name}
      checked={checked}
      onChange={onChange && (e => onChange(e.target.checked))}
      css={{ margin: ['auto', 4] }}
      type="checkbox"
    />{' '}
    <label htmlFor={name} css={{ padding: [0, 4], fontWeight: 400 }}>
      {children}
    </label>
  </Row>
)

export const Circle = props => (
  <circle
    css={{
      display: 'inline-block',
      borderRadius: 100,
      width: 18,
      height: 18,
      lineHeight: '18px',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      boxShadow: [[0, 0, 0, 0.5, highlightColor]],
      color: highlightColor,
      fontWeight: 500,
      fontSize: 12,
      margin: [-3, 4, 0, -2],
    }}
    {...props}
  />
)

export const Title = ({ center, children, ...props }) => (
  <UI.Title
    size={1.4}
    fontWeight={300}
    css={{
      padding: [0, 13, 2],
      alignItems: center ? 'center' : 'flex-start',
    }}
    {...props}
  >
    {children}
  </UI.Title>
)

export const VertSpace = view('div', {
  height: 20,
})

export const SubTitle = props => (
  <UI.Text
    alpha={0.65}
    fontWeight={300}
    fontSize={16}
    css={{
      alignItems: 'center',
      flexFlow: 'row',
      padding: [3, 0, 5],
      opacity: 0.75,
      marginBottom: 5,
    }}
    {...props}
  />
)

export const Link = props => (
  <UI.Text fontWeight={400} color="#8b2bec" display="inline" {...props} />
)

@view.ui
export class SmallLink extends React.Component {
  handleClick = () => {
    this.props.orbitStore.setQuery(this.props.children)
  }

  render({ children }) {
    return <span onClick={this.handleClick}>{children}</span>
  }
  static style = {
    span: {
      borderBottom: [2, 'transparent'],
      '&:hover': {
        borderBottom: [2, 'solid', [0, 0, 0, 0.1]],
      },
    },
  }
}
