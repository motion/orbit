import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

export * from './roundButton'

export const highlightColor = UI.color('#696549')

export const Message = view('div', {
  display: 'block',
  width: '100%',
  borderRadius: 8,
  border: [1, '#eee'],
  background: '#fff',
  padding: [10, 10],
  margin: [0, 0, 20],
  color: '#666',
})

export const Table = view('div', {
  display: 'table',
  width: '100%',
})

export const TableCell = view('div', {
  display: 'table-cell',
})

export const FormTableRow = view('section', {
  display: 'table-row',
  height: 40,
})

const inputCellProps = {
  css: {
    width: '70%',
  },
}

const labelCellProps = {
  css: {
    width: '30%',
  },
}

export const FormTableLabel = ({ children }) => (
  <TableCell {...labelCellProps}>{children}</TableCell>
)

export const FormTableValue = ({ children }) => (
  <TableCell {...inputCellProps}>{children}</TableCell>
)

// export const FormTableRow = view(TableRow, {

// })

export const InputRow = ({ label, type, value, onChange }) => (
  <FormTableRow>
    <FormTableLabel>
      <label css={{ padding: [0, 4], fontWeight: 400 }}>{label}</label>
    </FormTableLabel>
    <FormTableValue>
      <input
        css={{ fontSize: 16, padding: [7, 8], width: '100%' }}
        value={value}
        onChange={e => onChange(e.target.value)}
        type={type}
      />
    </FormTableValue>
  </FormTableRow>
)

export const CheckBoxRow = ({
  name = `checkbox-${Math.random()}`,
  children,
  checked,
  onChange,
}) => (
  <FormTableRow>
    <FormTableLabel>
      <label htmlFor={name} css={{ padding: [0, 4], fontWeight: 400 }}>
        {children}
      </label>
    </FormTableLabel>
    <FormTableValue>
      <input
        id={name}
        name={name}
        checked={checked}
        onChange={onChange && (e => onChange(e.target.checked))}
        css={{ margin: ['auto', 4] }}
        type="checkbox"
      />
    </FormTableValue>
  </FormTableRow>
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
