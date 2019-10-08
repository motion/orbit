import { fontProps } from '../constants'
import { Text } from './Text'

export const Paragraph = props => <Text {...fontProps.BodyFont} {...props} />
