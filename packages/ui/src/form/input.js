// @flow
import React from 'react'
import { color, inject, view } from '@mcro/black'
import Surface from '../surface'
import type { Color } from '@mcro/gloss'

@view
export default class Input {
  render() {
    return (
      <Surface
        width={150}
        borderRadius={0}
        {...this.props}
        tagName="input"
        wrapElement
      />
    )
  }

  static style = {
    input: {
      background: 'transparent',
      border: 'none',
      width: '100%',
      height: '100%',
    },
  }
}

// export type Props = {
//   chromeless?: boolean,
//   getRef?: Function,
//   sync?: Function,
//   inForm?: boolean,
//   noBorder?: boolean,
//   transparent?: boolean,
//   borderRadius?: number,
//   flex?: number | string,
//   padding?: number | Array<number>,
//   borderColor?: Color,
//   placeholder?: string,
//   placeholderColor?: Color,
//   width: number | string,
// }

// @inject(context => context.ui)
// @view.ui
// export default class Input {
//   static defaultProps = {
//     // width: 0,
//     borderRadius: 5,
//   }

//   render({
//     chromeless,
//     padding,
//     getRef,
//     sync,
//     inSegment,
//     inForm,
//     noBorder,
//     borderRadius,
//     flex,
//     transparent,
//     borderColor,
//     placeholderColor,
//     width,
//     ...props
//   }: Props) {
//     if (sync) {
//       props.value = sync.get()
//       props.onChange = e => sync.set(e.target.value)
//     }

//     return <input $$borderRadius={borderRadius} ref={getRef} {...props} />
//   }

//   static style = {
//     input: {
//       fontSize: 13,
//       lineHeight: '1rem',
//       alignSelf: 'center',
//       outline: 0,
//       minWidth: 30,
//     },
//   }

//   static theme = {
//     theme: (
//       {
//         chromeless,
//         padding,
//         placeholderColor,
//         borderColor,
//         fontSize,
//         transparent,
//         height,
//         type,
//         width,
//         style,
//       },
//       theme
//     ) => {
//       let styles = {}

//       if (!type || type === 'password' || type === 'text') {
//         styles = {
//           height: height || 30,
//           minHeight: height || 30,
//           padding: padding || [7, 8],
//           width: '100%',
//           border: [1, theme.base.borderColor],
//         }
//       }

//       return {
//         input: {
//           width,
//           fontSize,
//           ...theme.base,
//           borderColor: borderColor || theme.base.borderColor,
//           height,
//           minHeight: height,
//           ...styles,
//           ...(chromeless && {
//             background: 'none',
//             border: 'none',
//           }),
//           ...(transparent && { background: 'transparent' }),
//           '&::placeholder': {
//             color: placeholderColor,
//           },
//           '&:hover': {
//             borderColor: theme.hover.borderColor,
//           },
//           '&:focus': (style && style['&:focus']) || {
//             borderColor: color(theme.focus.borderColor).alpha(0.2),
//             borderWidth: 1,
//           },
//         },
//       }
//     },
//     noBorder: {
//       input: {
//         border: 'none',
//       },
//     },
//     disabled: {
//       input: {
//         pointerEvents: 'none',
//         opacity: 0.5,
//       },
//     },
//     width: ({ width }) => ({
//       input: {
//         maxWidth: width,
//       },
//     }),
//     inSegment: ({ borderRadius, inSegment: { first, last } }, theme) => ({
//       input: {
//         width: 0,
//         borderTopWidth: 1,
//         borderBottomWidth: 1,
//         borderRightWidth: 1,
//         borderLeftWidth: 1,
//         marginLeft: first ? 0 : -1,
//         borderRadius: 'auto',
//         borderLeftRadius: first ? borderRadius : 0,
//         borderRightRadius: last ? borderRadius : 0,
//         borderColor: last
//           ? theme.base.borderColor
//           : theme.base.borderColorLight,
//         '&:focus': {
//           ...theme.focus,
//           zIndex: 1000,
//         },
//       },
//     }),
//   }
// }
