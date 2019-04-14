import { gloss } from '@o/gloss';
import { Text } from '@o/ui';
import React from 'react';

export const TitleText = gloss(
  props => (
    <Text
      {...{
        size: 'xl',
        fontWeight: 800,
        selectable: true,
        textAlign: 'center'
      }}
      {...props}
    />
  ),
  {
    fontFamily: 'gt eesti pro display trial',
  },
)
