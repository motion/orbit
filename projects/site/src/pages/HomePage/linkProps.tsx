import { ButtonProps } from '@o/ui'

import { Navigation } from '../../Navigation'

export const linkProps = (href): ButtonProps => {
  return {
    // @ts-ignore
    href,
    tagName: 'a',
    textDecoration: 'none',
    cursor: 'pointer',
    onClick(e) {
      e.preventDefault()
      Navigation.navigate(href)
    },
  }
}
