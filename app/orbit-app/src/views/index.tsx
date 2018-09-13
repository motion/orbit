import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
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

export const FormTableLabel = ({ children }) => <TableCell width="30%">{children}</TableCell>

export const FormTableValue = ({ children }) => <TableCell width="70%">{children}</TableCell>

const Label = props => <Text tagName="label" {...props} />

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
      <Input value={value} onChange={e => onChange(e.target.value)} type={type} />
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

export const SuggestionBarVerticalPad = view({
  height: 24,
  pointerEvents: 'none',
})

export const SmallVerticalSpace = view({
  height: 10,
})

export const VerticalSpace = view({
  height: 16,
  small: {
    height: 8,
  },
})

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

export const Title = ({ verticalSpacing = 1, children, ...props }) => (
  <UI.Text size={1.35} fontWeight={700} margin={[0, 0, 12 * verticalSpacing]} {...props}>
    {children}
  </UI.Text>
)

export const VertSpace = view({
  height: 20,
})

export const SubTitle = ({ verticalSpacing = 1, children, ...props }) => (
  <UI.Text
    alpha={0.7}
    fontWeight={400}
    size={1.05}
    alignItems="center"
    flexFlow="row"
    padding={[4 * verticalSpacing, 0, 10 * verticalSpacing]}
    opacity={0.75}
    {...props}
  >
    {children}
  </UI.Text>
)

export const Link = props => (
  <UI.Text cursor="pointer" fontWeight={400} color="#8b2bec" display="inline" {...props} />
)

export const AppWrapper = view(UI.Col, {
  // background: [0, 0, 0, 0.1],
  maxWidth: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  userSelect: 'none',
  position: 'relative',
})
