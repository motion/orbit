// /**
//  * Note CSS Typed OM doesn't support this so had to bail:
//  *
//  *   new CSSMathProduct(new CSSVariableReferenceValue('--something'), CSS.px(1))
//  *
//  * Can't multiple variables, but you can in css...
//  *
//  */

// declare const CSS: any
// declare const CSSVariableReferenceValue: any
// declare const CSSUnparsedValue: any
// declare const CSSMathProduct: any
// declare const CSSMathSum: any
// declare const CSSMathMin: any
// declare const CSSMathMax: any
// declare const CSSMathNegate: any

// class CSSValue {
//   current: any = null
//   constructor(initial: any, ...fallbacks: any) {
//     console.log('initial', initial)
//     this.current =
//       initial[0] === '-' && initial[1] === '-'
//         ? new CSSVariableReferenceValue(initial, new CSSUnparsedValue(fallbacks))
//         : new CSSUnparsedValue([initial])
//   }
//   mult(...vals: any) {
//     return new CSSMathProduct(this.current, ...vals)
//   }
//   sum(...vals: any) {
//     return new CSSMathSum(this.current, ...vals)
//   }
//   negate() {
//     return new CSSMathNegate(this.current)
//   }
//   min(val: any) {
//     return new CSSMathMin(this.current, val)
//   }
//   max(val: any) {
//     return new CSSMathMax(this.current, val)
//   }
// }

// const val = (initial: any, ...values: any[]) => {
//   return new CSSValue(initial, ...values)
// }

// export function getTextSizeTheme(props: TextSizeProps) {
//   const size = CSS.px(props.size ?? 1)
//   const scale = val('--scale', 1)
//   const sizeFont = CSS.px(props.sizeFont === true ? 1 : props.sizeFont ?? 1)
//   const sizeLineHeight = CSS.px(props.sizeLineHeight === true ? 1 : props.sizeLineHeight ?? 1)
//   const fontSize = scale.mult(size, sizeFont, 14)
//   const lineHeight = scale.mult(size, sizeLineHeight, 14 * 1.2).add(4)
//   const marginV = lineHeight.negate().mult(0.1)
//   return {
//     fontSize: CSS.px(fontSize),
//     lineHeight: CSS.px(lineHeight),
//     marginTop: marginV,
//     marginBottom: marginV,
//   }
// }
