import { View } from '@o/ui'
import * as React from 'react'

import { mediaStyles } from '../constants'

export const MediaNotSmall = props => <View {...mediaStyles.hidden['not-sm']} {...props} />
