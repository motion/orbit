/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import styled from '../styled/index'
import {inputStyle} from './Input'

export default styled.customHTMLTag(
  'textarea',
  {
    ...inputStyle,
    lineHeight: 'normal',
    padding: props => (props.compact ? '5px' : '8px'),
    resize: 'none',
  },
  {
    ignoreAttributes: ['compact'],
  },
);
