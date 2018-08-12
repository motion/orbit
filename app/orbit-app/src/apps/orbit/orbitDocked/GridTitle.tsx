import { SubTitle } from '../../../views'
import { Separator } from './OrbitDirectory'

export const GridTitle = props => (
  <Separator>
    <SubTitle
      fontSize={15}
      lineHeight={15}
      fontWeight={600}
      padding={0}
      {...props}
    />
  </Separator>
)
