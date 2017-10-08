import * as UI from '@mcro/ui'

export const SubTitle = props => (
  <UI.Title
    fontWeight={400}
    color={[0, 0, 0, 0.4]}
    marginBottom={5}
    {...props}
  />
)

export const Link = props => (
  <UI.Text fontWeight={400} color="#000" display="inline" {...props} />
)
