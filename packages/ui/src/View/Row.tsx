import { ColProps, createBaseView } from './Col'

export type RowProps = ColProps

export const Row = createBaseView({ flexDirection: 'row', 'data-is': 'Row' })
