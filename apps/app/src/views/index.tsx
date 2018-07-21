import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { OrbitStore } from '../apps/orbit/OrbitStore';

export * from './RoundButton'

export const highlightColor = UI.color('#696549')

export const Table = view({
  display: 'table',
  width: '100%',
})

export const TableCell = view({
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

export const Circle = view({
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
})

export const Title = ({ center, children, ...props }) => (
  <UI.Text
    size={1.4}
    fontWeight={300}
    css={{
      padding: [0, 13, 2],
      alignItems: center ? 'center' : 'flex-start',
    }}
    {...props}
  >
    {children}
  </UI.Text>
)

export const VertSpace = view({
  height: 20,
})

export const SubTitle = ({ verticalSpacing = 1, ...props }) => (
  <UI.Text
    alpha={0.65}
    fontWeight={300}
    fontSize={16}
    alignItems="center"
    flexFlow="row"
    padding={[3 * verticalSpacing, 0, 10 * verticalSpacing]}
    opacity={0.75}
    {...props}
  />
)

export const Link = props => (
  <UI.Text
    cursor="pointer"
    fontWeight={400}
    color="#8b2bec"
    display="inline"
    {...props}
  />
)

const SmallLinkContainer = view('span', {
  borderBottom: [2, 'transparent'],
  '&:hover': {
    borderBottom: [2, 'solid', [0, 0, 0, 0.1]],
  },
})

@view.ui
export class SmallLink extends React.Component<{ orbitStore?: OrbitStore }> {
  handleClick = () => {
    if (this.props.orbitStore) {
      this.props.orbitStore.setQuery(this.props.children)
    }
  }

  render() {
    return (
      <SmallLinkContainer onDoubleClick={this.handleClick} {...this.props} />
    )
  }
}
