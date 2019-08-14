import { getSpaceSize } from '../Space'

/**
 * This can only be used on the innermost element to space its children, css-specific
 */
export function wrappingSpaceTheme(props) {
  if (props.isWrapped) {
    const space = getSpaceSize(props.parentSpacing)
    return {
      marginBottom: -space,
      '& > *': {
        marginBottom: `${space}px !important`,
      },
    }
  }
}
