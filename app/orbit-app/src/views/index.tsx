import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SearchStore } from '../stores/SearchStore'
import { View, Row, Text } from '@mcro/ui'
import { Input } from './Input'

export * from './RoundButton'

export const highlightColor = UI.color('#696549')

export const Table = view(View, {
  width: '100%',
})

export const TableCell = view(View, {
  padding: [4, 0],
})

export const FormTableRow = view(Row, {
  width: '100%',
  minHeight: 32,
  alignItems: 'center',
})

export const FormTableLabel = ({ children }) => (
  <TableCell width="30%">{children}</TableCell>
)

export const FormTableValue = ({ children }) => (
  <TableCell width="70%">{children}</TableCell>
)

const Label = props => <Text tagName="lable" {...props} />

export const FormRow = ({ label, children }) => (
  <FormTableRow>
    <FormTableLabel>
      <Label>{label}</Label>
    </FormTableLabel>
    <FormTableValue>{children}</FormTableValue>
  </FormTableRow>
)

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

export const Title = ({ verticalSpacing = 1, ...props }) => (
  <UI.Text
    size={1.4}
    fontWeight={300}
    padding={[5 * verticalSpacing, 0, 12 * verticalSpacing]}
    {...props}
  />
)

export const VertSpace = view({
  height: 20,
})

export const SubTitle = ({ verticalSpacing = 1, ...props }) => (
  <UI.Text
    alpha={0.7}
    fontWeight={400}
    fontSize={16}
    alignItems="center"
    flexFlow="row"
    padding={[4 * verticalSpacing, 0, 10 * verticalSpacing]}
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
