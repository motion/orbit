import { Text } from '@mcro/ui'

export const SubTitle = ({ verticalSpacing = 1, ...props }) => (<Text alpha={0.65} fontWeight={300} fontSize={16} alignItems="center" flexFlow="row" padding={[3 * verticalSpacing, 0, 10 * verticalSpacing]} opacity={0.75} {...props} />);