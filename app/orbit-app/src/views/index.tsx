import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SearchStore } from '../stores/SearchStore'

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

const Label = view('label', { padding: [0, 4], fontWeight: 400 })
const Input = view('input', { fontSize: 16, padding: [7, 8], width: '100%' })

export const InputRow = ({ label, type = 'input', value, onChange }) => (
  <FormTableRow>
    <FormTableLabel>
      <Label>{label}</Label>
    </FormTableLabel>
    <FormTableValue>
      <Input
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
      <Label htmlFor={name}>{children}</Label>
    </FormTableLabel>
    <FormTableValue>
      <input
        id={name}
        name={name}
        checked={checked}
        onChange={onChange && (e => onChange(e.target.checked))}
        style={{ margin: `auto 4px` }}
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
export class SmallLink extends React.Component<{ searchStore?: SearchStore }> {
  handleClick = () => {
    if (this.props.searchStore) {
      this.props.searchStore.setQuery(this.props.children)
    }
  }

  render() {
    return (
      <SmallLinkContainer onDoubleClick={this.handleClick} {...this.props} />
    )
  }
}
