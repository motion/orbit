import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SearchStore } from '../stores/SearchStore'
import { View, Row } from '@mcro/ui'

export * from './RoundButton'

export const highlightColor = UI.color('#696549')

export const Table = view(View, {
  width: '100%',
})

export const TableCell = view(View, {})

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

const Label = view('label', { padding: [0, 4], fontWeight: 400 })

export const Input = view(View, {
  position: 'relative',
  flexFlow: 'row',
  borderRadius: 5,
  height: '100%',
  width: '100%',
  alignItems: 'center',
  padding: [6, 12],
  background: [255, 255, 255, 0.1],
})
Input.theme = ({ theme }) => ({
  border: [1, theme.base.borderColor.desaturate(0.1)],
  '&:focus-within': {
    boxShadow: [[0, 0, 0, 2, theme.base.borderColor.alpha(0.5)]], // `0 0 0 2px rgba(255,255,255,0.2)`,
  },
})
Input.defaultProps = {
  tagName: 'input',
}

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
