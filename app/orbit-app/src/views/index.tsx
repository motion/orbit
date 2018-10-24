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

export const InputRow = ({
  label,
  type = 'input',
  value = undefined,
  onChange = null,
  ...props
}) => (
  <FormTableRow>
    <FormTableLabel>
      <Label>{label}</Label>
    </FormTableLabel>
    <FormTableValue>
      <Input value={value} onChange={e => onChange(e.target.value)} type={type} {...props} />
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

export const OrbitNavVerticalPad = () => <div style={{ height: 130, pointerEvents: 'none' }} />

export const SuggestionBarVerticalPad = view({
  height: 24,
  pointerEvents: 'none',
})

export const SmallVerticalSpace = view({
  height: 10,
})

export const HorizontalScroll = view(Row, {
  overflowX: 'scroll',
  flex: 1,
  flexFlow: 'row',
  alignItems: 'center',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

export const HorizontalSpace = view({
  width: 10,
})

export const VerticalSpace = view({
  pointerEvents: 'none',
  height: 16,
  small: {
    height: 8,
  },
})

export const Title = ({ verticalSpacing = 1, children, ...props }) => (
  <UI.Text size={1.35} fontWeight={700} marginBottom={12 * verticalSpacing} {...props}>
    {children}
  </UI.Text>
)

export const SubPaneTitle = props => {
  return <Title marginLeft={12} marginRight={12} {...props} />
}

export const SubTitle = ({ verticalSpacing = 1, children, ...props }) => (
  <UI.Text
    alpha={0.7}
    fontWeight={400}
    size={1.05}
    alignItems="center"
    flexFlow="row"
    padding={[4 * verticalSpacing, 0, 10 * verticalSpacing]}
    {...props}
  >
    {children}
  </UI.Text>
)

export const SubPaneSubTitle = props => {
  return <SubTitle marginLeft={12} marginRight={12} {...props} />
}

export const SubPaneSection = view({
  padding: [0, 12],
})

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
