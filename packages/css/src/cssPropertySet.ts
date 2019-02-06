import { Color } from './types'

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

export type alignContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'stretch'
export type alignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
export type alignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
export type all = 'initial' | 'inherit' | 'unset'
export type animation = singleAnimation
export type animationDelay = number
export type animationDirection = singleAnimationDirection
export type animationDuration = string | number
export type animationFillMode = singleAnimationFillMode
export type animationIterationCount = singleAnimationIterationCount
export type animationName = singleAnimationName
export type animationPlayState = singleAnimationPlayState
export type animationTimingFunction = singleTimingFunction
export type appearance = 'auto' | 'none'
export type azimuth = number | string | 'leftwards' | 'rightwards'
export type backdropFilter = 'none' | string
export type backfaceVisibility = 'visible' | 'hidden'
type backgroundSyntax = {
  attachment?: attachment
  color?: Color
  image?: bgImage
  position?: string
  repeat?: repeatStyle
}
export type background = string | number[] | finalBgLayer | backgroundSyntax | Color
export type backgroundAttachment = attachment
export type backgroundBlendMode = blendMode
export type backgroundClip = box
export type backgroundColor = Color
export type backgroundImage = bgImage
export type backgroundOrigin = box
export type backgroundPosition = string
export type backgroundPositionX = string
export type backgroundPositionY = string
export type backgroundRepeat = repeatStyle
export type backgroundSize = bgSize
export type blockSize = width
type borderSyntax = (number | string | Color)[]
export type border = borderWidth | brStyle | Color | borderSyntax
export type borderBlockEnd = borderWidth | borderStyle | Color
export type borderBlockEndColor = Color
export type borderBlockEndStyle = borderStyle
export type borderBlockEndWidth = borderWidth
export type borderBlockStart = borderWidth | borderStyle | Color
export type borderBlockStartColor = Color
export type borderBlockStartStyle = borderStyle
export type borderBlockStartWidth = borderWidth
export type borderBottomLeftRadius = lengthPercentage
export type borderBottomRightRadius = lengthPercentage
export type borderBottomStyle = brStyle
export type borderBottomWidth = borderWidth
export type borderCollapse = 'collapse' | 'separate'
export type borderColor = Color | Array<number | string | Color>
export type borderImage = borderImageSource | borderImageSlice | string | borderImageRepeat
export type borderImageOutset = string
export type borderImageRepeat = string
export type borderImageSlice = string | number | 'fill'
export type borderImageSource = 'none' | string
export type borderImageWidth = string
export type borderInlineEnd = borderWidth | borderStyle | Color
export type borderInlineEndColor = Color
export type borderInlineEndStyle = borderStyle
export type borderInlineEndWidth = borderWidth
export type borderInlineStart = borderWidth | borderStyle | Color
export type borderInlineStartColor = Color
export type borderInlineStartStyle = borderStyle
export type borderInlineStartWidth = borderWidth
export type borderLeftColor = Color
export type borderLeftStyle = brStyle
export type borderLeftWidth = borderWidth
export type borderRightColor = Color
export type borderRightStyle = brStyle
export type borderRightWidth = borderWidth
export type borderRadius = lengthPercentage
export type borderSpacing = number
export type borderStyle = brStyle
export type borderTopLeftRadius = lengthPercentage
export type borderTopRightRadius = lengthPercentage
export type borderTopStyle = brStyle
export type borderTopWidth = borderWidth
export type boxAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch'
export type boxDecorationBreak = 'slice' | 'clone'
export type boxDirection = 'normal' | 'reverse' | 'inherit'
export type boxFlex = number
export type boxFlexGroup = number
export type boxLines = 'single' | 'multiple'
export type boxOrdinalGroup = number
export type boxOrient = 'horizontal' | 'vertical' | 'inline-axis' | 'block-axis' | 'inherit'
export type boxPack = 'start' | 'center' | 'end' | 'justify'
type boxShadowSyntax = {
  x?: number
  y?: number
  blur?: number
  spread?: number
  color?: string
  inset?: boolean
}
export type boxShadow =
  | 'none'
  | number
  | string
  | boxShadowSyntax
  | (number | Color)[][]
  | (number | Color | string)[][]
export type boxSizing = 'content-box' | 'border-box'
export type boxSuppress = 'show' | 'discard' | 'hide'
export type breakAfter =
  | 'auto'
  | 'avoid'
  | 'avoid-page'
  | 'page'
  | 'left'
  | 'right'
  | 'recto'
  | 'verso'
  | 'avoid-column'
  | 'column'
  | 'avoid-region'
  | 'region'
export type breakBefore =
  | 'auto'
  | 'avoid'
  | 'avoid-page'
  | 'page'
  | 'left'
  | 'right'
  | 'recto'
  | 'verso'
  | 'avoid-column'
  | 'column'
  | 'avoid-region'
  | 'region'
export type breakInside = 'auto' | 'avoid' | 'avoid-page' | 'avoid-column' | 'avoid-region'
export type captionSide =
  | 'top'
  | 'bottom'
  | 'block-start'
  | 'block-end'
  | 'inline-start'
  | 'inline-end'
export type clear = 'none' | 'left' | 'right' | 'both' | 'inline-start' | 'inline-end'
export type clip = string | 'auto'
export type clipPath = string | 'none'
export type columnCount = number | 'auto'
export type columnFill = 'auto' | 'balance'
export type columnGap = number | 'normal'
export type columnRule = columnRuleWidth | columnRuleStyle | columnRuleColor
export type columnRuleColor = Color
export type columnRuleStyle = brStyle
export type columnRuleWidth = borderWidth
export type columnSpan = 'none' | 'all'
export type columnWidth = number | 'auto'
export type columns = columnWidth | columnCount
export type contain = 'none' | 'strict' | 'content' | string
export type content = string
export type counterIncrement = string | 'none'
export type counterReset = string | 'none'
export type cursor =
  | 'auto'
  | 'default'
  | 'none'
  | 'context-menu'
  | 'help'
  | 'pointer'
  | 'progress'
  | 'wait'
  | 'cell'
  | 'crosshair'
  | 'text'
  | 'vertical-text'
  | 'alias'
  | 'copy'
  | 'move'
  | 'no-drop'
  | 'not-allowed'
  | 'e-resize'
  | 'n-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 's-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'w-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'col-resize'
  | 'row-resize'
  | 'all-scroll'
  | 'zoom-in'
  | 'zoom-out'
  | 'grab'
  | 'grabbing'
  | '-webkit-grab'
  | '-webkit-grabbing'
export type direction = 'ltr' | 'rtl'
export type display =
  | 'none'
  | 'inline'
  | 'block'
  | 'list-item'
  | 'inline-list-item'
  | 'inline-block'
  | 'inline-table'
  | 'table'
  | 'table-cell'
  | 'table-column'
  | 'table-column-group'
  | 'table-footer-group'
  | 'table-header-group'
  | 'table-row'
  | 'table-row-group'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'run-in'
  | 'ruby'
  | 'ruby-base'
  | 'ruby-text'
  | 'ruby-base-container'
  | 'ruby-text-container'
  | 'contents'
export type displayInside = 'auto' | 'block' | 'table' | 'flex' | 'grid' | 'ruby'
export type displayList = 'none' | 'list-item'
export type displayOutside =
  | 'block-level'
  | 'inline-level'
  | 'run-in'
  | 'contents'
  | 'none'
  | 'table-row-group'
  | 'table-header-group'
  | 'table-footer-group'
  | 'table-row'
  | 'table-cell'
  | 'table-column-group'
  | 'table-column'
  | 'table-caption'
  | 'ruby-base'
  | 'ruby-text'
  | 'ruby-base-container'
  | 'ruby-text-container'
export type emptyCells = 'show' | 'hide'
export type filter = 'none' | string
export type flex = 'none' | string | number
export type flexBasis = 'content' | number | string
export type flexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type flexFlow = flexDirection | flexWrap
export type flexGrow = number
export type flexShrink = number
export type flexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
export type float = 'left' | 'right' | 'none' | 'inline-start' | 'inline-end'
export type font =
  | string
  | 'caption'
  | 'icon'
  | 'menu'
  | 'message-box'
  | 'small-caption'
  | 'status-bar'
export type fontFamily = string
export type fontFeatureSettings = 'normal' | string
export type fontKerning = 'auto' | 'normal' | 'none'
export type fontLanguageOverride = 'normal' | string
export type fontSize = absoluteSize | relativeSize | lengthPercentage
export type fontSizeAdjust = 'none' | number
export type fontStretch =
  | 'normal'
  | 'ultra-condensed'
  | 'extra-condensed'
  | 'condensed'
  | 'semi-condensed'
  | 'semi-expanded'
  | 'expanded'
  | 'extra-expanded'
  | 'ultra-expanded'
export type fontStyle = 'normal' | 'italic' | 'oblique'
export type fontSynthesis = 'none' | string
export type fontVariant = 'normal' | 'none' | string
export type fontVariantAlternates = 'normal' | string
export type fontVariantCaps =
  | 'normal'
  | 'small-caps'
  | 'all-small-caps'
  | 'petite-caps'
  | 'all-petite-caps'
  | 'unicase'
  | 'titling-caps'
export type fontVariantEastAsian = 'normal' | string
export type fontVariantLigatures = 'normal' | 'none' | string
export type fontVariantNumeric = 'normal' | string
export type fontVariantPosition = 'normal' | 'sub' | 'super'
export type fontWeight =
  | 'inherit'
  | 'normal'
  | 'bold'
  | 'bolder'
  | 'lighter'
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
export type grid = gridTemplate | string
export type gridArea = gridLine | string
export type gridAutoColumns = trackSize
export type gridAutoFlow = string | 'dense'
export type gridAutoRows = trackSize
export type gridColumn = gridLine | string
export type gridColumnEnd = gridLine
export type gridColumnGap = lengthPercentage
export type gridColumnStart = gridLine
export type gridGap = gridRowGap | gridColumnGap
export type gridRow = gridLine | string
export type gridRowEnd = gridLine
export type gridRowGap = lengthPercentage
export type gridRowStart = gridLine
export type gridTemplate = 'none' | 'subgrid' | string
export type gridTemplateAreas = 'none' | string
export type gridTemplateColumns = 'none' | 'subgrid' | string
export type gridTemplateRows = 'none' | 'subgrid' | string
export type hyphens = 'none' | 'manual' | 'auto'
export type imageOrientation = 'from-image' | number | string
export type imageRendering =
  | 'auto'
  | 'crisp-edges'
  | 'pixelated'
  | 'optimizeSpeed'
  | 'optimizeQuality'
  | string
export type imageResolution = string | 'snap'
export type imeMode = 'auto' | 'normal' | 'active' | 'inactive' | 'disabled'
export type initialLetter = 'normal' | string
export type initialLetterAlign = string
export type inlineSize = width
export type isolation = 'auto' | 'isolate'
export type justifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'stretch'
export type letterSpacing = 'normal' | lengthPercentage
export type lineBreak = 'auto' | 'loose' | 'normal' | 'strict'
export type lineHeight = 'normal' | number | string
export type listStyle = listStyleType | listStylePosition | listStyleImage
export type listStyleImage = string | 'none'
export type listStylePosition = 'inside' | 'outside'
export type listStyleType = string | 'none'
type marginSyntax = Array<number | string>
export type margin = number | string | marginSyntax
export type marginBlockEnd = marginLeft
export type marginBlockStart = marginLeft
export type marginBottom = number | string | 'auto'
export type marginInlineEnd = marginLeft
export type marginInlineStart = marginLeft
export type marginLeft = number | string | 'auto'
export type marginRight = number | string | 'auto'
export type marginTop = number | string | 'auto'
export type markerOffset = number | 'auto'
export type mask = maskLayer
export type maskClip = string
export type maskComposite = compositeOperator
export type maskMode = maskingMode
export type maskOrigin = geometryBox
export type maskPosition = string
export type maskRepeat = repeatStyle
export type maskSize = bgSize
export type maskType = 'luminance' | 'alpha'
export type maxBlockSize = maxWidth
export type maxHeight =
  | number
  | string
  | 'none'
  | 'max-content'
  | 'min-content'
  | 'fit-content'
  | 'fill-available'
export type maxInlineSize = maxWidth
export type maxWidth =
  | number
  | string
  | 'none'
  | 'max-content'
  | 'min-content'
  | 'fit-content'
  | 'fill-available'
export type minBlockSize = minWidth
export type minHeight =
  | number
  | string
  | 'auto'
  | 'max-content'
  | 'min-content'
  | 'fit-content'
  | 'fill-available'
export type minInlineSize = minWidth
export type minWidth =
  | number
  | string
  | 'auto'
  | 'max-content'
  | 'min-content'
  | 'fit-content'
  | 'fill-available'
export type mixBlendMode = blendMode
export type motion = motionPath | motionOffset | motionRotation
export type motionOffset = lengthPercentage
export type motionPath = string | geometryBox | 'none'
export type motionRotation = string | number
export type objectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
export type objectPosition = string
export type offsetBlockEnd = string
export type offsetBlockStart = string
export type offsetInlineEnd = string
export type offsetInlineStart = string
export type opacity = number
export type order = number | 'auto'
export type orphans = number
type outlineSyntax = {
  width?: borderWidth
  style?: brStyle
  color?: Color
}
export type outline = string | outlineSyntax
export type outlineColor = Color | 'invert'
export type outlineOffset = number
export type outlineStyle = 'auto' | brStyle
export type outlineWidth = borderWidth
export type overflow = 'visible' | 'hidden' | 'scroll' | 'auto'
export type overflowClipBox = 'padding-box' | 'content-box'
export type overflowWrap = 'normal' | 'break-word'
export type overflowX = 'visible' | 'hidden' | 'scroll' | 'auto'
export type overflowY = 'visible' | 'hidden' | 'scroll' | 'auto'
type paddingSyntax = Array<number | string>
export type padding = number | string | paddingSyntax
export type paddingBlockEnd = paddingLeft
export type paddingBlockStart = paddingLeft
export type paddingBottom = number | string
export type paddingInlineEnd = paddingLeft
export type paddingInlineStart = paddingLeft
export type paddingLeft = number | string
export type paddingRight = number | string
export type paddingTop = number | string
export type pageBreakAfter = 'auto' | 'always' | 'avoid' | 'left' | 'right'
export type pageBreakBefore = 'auto' | 'always' | 'avoid' | 'left' | 'right'
export type pageBreakInside = 'auto' | 'avoid'
export type perspective = 'none' | number
export type perspectiveOrigin = string
export type pointerEvents =
  | 'auto'
  | 'none'
  | 'visiblePainted'
  | 'visibleFill'
  | 'visibleStroke'
  | 'visible'
  | 'painted'
  | 'fill'
  | 'stroke'
  | 'all'
  | 'inherit'
export type position = 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed'
export type quotes = string | 'none'
export type resize = 'none' | 'both' | 'horizontal' | 'vertical'
export type rubyAlign = 'start' | 'center' | 'space-between' | 'space-around'
export type rubyMerge = 'separate' | 'collapse' | 'auto'
export type rubyPosition = 'over' | 'under' | 'inter-character'
export type scrollBehavior = 'auto' | 'smooth'
export type scrollSnapCoordinate = 'none' | string
export type scrollSnapDestination = string
export type scrollSnapPointsX = 'none' | string
export type scrollSnapPointsY = 'none' | string
export type scrollSnapType = 'none' | 'mandatory' | 'proximity'
export type scrollSnapTypeX = 'none' | 'mandatory' | 'proximity'
export type scrollSnapTypeY = 'none' | 'mandatory' | 'proximity'
export type shapeImageThreshold = number
export type shapeMargin = lengthPercentage
export type shapeOutside = 'none' | shapeBox | string
export type tabSize = number
export type tableLayout = 'auto' | 'fixed'
export type textAlign = 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent'
export type textAlignLast = 'auto' | 'start' | 'end' | 'left' | 'right' | 'center' | 'justify'
export type textCombineUpright = 'none' | 'all' | string
export type textDecoration = textDecorationLine | textDecorationStyle | textDecorationColor
export type textDecorationColor = Color
export type textDecorationLine = 'none' | string
export type textDecorationSkip = 'none' | string
export type textDecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy'
export type textEmphasis = textEmphasisStyle | textEmphasisColor
export type textEmphasisColor = Color
export type textEmphasisPosition = string
export type textEmphasisStyle = 'none' | string
export type textIndent = string | 'hanging' | 'each-line'
export type textOrientation = 'mixed' | 'upright' | 'sideways'
export type textOverflow = 'clip' | 'ellipsis' | 'auto'
export type textRendering = 'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision'
type textShadowSyntax = {
  x?: number
  y?: number
  blur?: number
  color?: string
}
export type textShadow = 'none' | string | textShadowSyntax
export type textSizeAdjust = 'none' | 'auto' | string
export type textTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'full-width'
export type textUnderlinePosition = 'auto' | string
export type touchAction = 'auto' | 'none' | string | 'manipulation'
type transformSyntax = {
  x?: number | string
  y?: number | string
  z?: number | string
  rotate?: string
  scale?: number | string
  scaleX?: number | string
  scaleY?: number | string
  scaleZ?: number | string
}
export type transform = 'none' | string | transformSyntax
export type transformBox = 'border-box' | 'fill-box' | 'view-box'
export type transformOrigin = string | number
export type transformStyle = 'flat' | 'preserve-3d'
type transitionSyntax = {
  property?: 'none' | singleTransitionProperty
  duration?: number
  timingFunction?: singleTransitionTimingFunction
  delay?: number
}
export type transition =
  | singleTransition
  | transitionSyntax
  | Array<singleTransition | transitionSyntax>
export type transitionDelay = number
export type transitionDuration = number
export type transitionProperty = 'none' | singleTransitionProperty
export type transitionTimingFunction = singleTransitionTimingFunction
export type unicodeBidi =
  | 'normal'
  | 'embed'
  | 'isolate'
  | 'bidi-override'
  | 'isolate-override'
  | 'plaintext'
export type userSelect = 'auto' | 'text' | 'none' | 'contain' | 'all'
export type verticalAlign =
  | 'baseline'
  | 'sub'
  | 'super'
  | 'text-top'
  | 'text-bottom'
  | 'middle'
  | 'top'
  | 'bottom'
  | string
  | number
export type visibility = 'visible' | 'hidden' | 'collapse'
export type whiteSpace = 'inherit' | 'normal' | 'pre' | 'nowrap' | 'pre-wrap' | 'pre-line'
export type widows = number
export type width = string | 'available' | 'min-content' | 'max-content' | 'fit-content' | 'auto'
export type willChange = 'auto' | animatableFeature
export type wordBreak = 'normal' | 'break-all' | 'keep-all' | nonStandardWordBreak
export type wordSpacing = 'normal' | lengthPercentage
export type wordWrap = 'normal' | 'break-word'
export type writingMode =
  | 'horizontal-tb'
  | 'vertical-rl'
  | 'vertical-lr'
  | 'sideways-rl'
  | 'sideways-lr'
  | svgWritingMode
export type zIndex = 'auto' | number
export type alignmentBaseline =
  | 'auto'
  | 'baseline'
  | 'before-edge'
  | 'text-before-edge'
  | 'middle'
  | 'central'
  | 'after-edge'
  | 'text-after-edge'
  | 'ideographic'
  | 'alphabetic'
  | 'hanging'
  | 'mathematical'
export type baselineShift = 'baseline' | 'sub' | 'super' | svgLength
export type behavior = string
export type clipRule = 'nonzero' | 'evenodd'
export type cue = cueBefore | cueAfter
export type cueAfter = string | number | 'none'
export type cueBefore = string | number | 'none'
export type dominantBaseline =
  | 'auto'
  | 'use-script'
  | 'no-change'
  | 'reset-size'
  | 'ideographic'
  | 'alphabetic'
  | 'hanging'
  | 'mathematical'
  | 'central'
  | 'middle'
  | 'text-after-edge'
  | 'text-before-edge'
export type fill = paint
export type fillOpacity = number
export type fillRule = 'nonzero' | 'evenodd'
export type glyphOrientationHorizontal = number
export type glyphOrientationVertical = number
export type kerning = 'auto' | svgLength
export type marker = 'none' | string
export type markerEnd = 'none' | string
export type markerMid = 'none' | string
export type markerStart = 'none' | string
export type pause = pauseBefore | pauseAfter
export type pauseAfter = number | 'none' | 'x-weak' | 'weak' | 'medium' | 'strong' | 'x-strong'
export type pauseBefore = number | 'none' | 'x-weak' | 'weak' | 'medium' | 'strong' | 'x-strong'
export type rest = restBefore | restAfter
export type restAfter = number | 'none' | 'x-weak' | 'weak' | 'medium' | 'strong' | 'x-strong'
export type restBefore = number | 'none' | 'x-weak' | 'weak' | 'medium' | 'strong' | 'x-strong'
export type shapeRendering = 'auto' | 'optimizeSpeed' | 'crispEdges' | 'geometricPrecision'
export type src = string
export type speak = 'auto' | 'none' | 'normal'
export type speakAs = 'normal' | 'spell-out' | 'digits' | string
export type stroke = paint
export type strokeDasharray = 'none' | string
export type strokeDashoffset = svgLength
export type strokeLinecap = 'butt' | 'round' | 'square'
export type strokeLinejoin = 'miter' | 'round' | 'bevel'
export type strokeMiterlimit = number
export type strokeOpacity = number
export type strokeWidth = svgLength
export type textAnchor = 'start' | 'middle' | 'end'
export type unicodeRange = string
export type voiceBalance = number | 'left' | 'center' | 'right' | 'leftwards' | 'rightwards'
export type voiceDuration = 'auto' | number
export type voiceFamily = string | 'preserve'
export type voicePitch = number | 'absolute' | string
export type voiceRange = number | 'absolute' | string
export type voiceRate = string
export type voiceStress = 'normal' | 'strong' | 'moderate' | 'none' | 'reduced'
export type voiceVolume = 'silent' | string
export type zoom = 'normal' | 'reset' | number | string
export type absoluteSize =
  | 'xx-small'
  | 'x-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'x-large'
  | 'xx-large'
export type animatableFeature = 'scroll-position' | 'contents' | string
export type attachment = 'scroll' | 'fixed' | 'local'
export type bgImage = 'none' | string
export type bgSize = string | 'cover' | 'contain'
export type box = 'border-box' | 'padding-box' | 'content-box'
export type brStyle =
  | 'none'
  | 'hidden'
  | 'dotted'
  | 'dashed'
  | 'solid'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'inset'
  | 'outset'
export type borderWidth = number | 'thin' | 'medium' | 'thick' | string
export type Color = string | Color | number[]
export type compositeStyle =
  | 'clear'
  | 'copy'
  | 'source-over'
  | 'source-in'
  | 'source-out'
  | 'source-atop'
  | 'destination-over'
  | 'destination-in'
  | 'destination-out'
  | 'destination-atop'
  | 'xor'
export type compositeOperator = 'add' | 'subtract' | 'intersect' | 'exclude'
export type finalBgLayer = bgImage | string | repeatStyle | attachment | box | backgroundColor
export type geometryBox = shapeBox | 'fill-box' | 'stroke-box' | 'view-box'
export type gridLine = 'auto' | string
export type lengthPercentage = number | string
export type maskLayer =
  | maskReference
  | maskingMode
  | string
  | repeatStyle
  | geometryBox
  | compositeOperator
export type maskReference = 'none' | string
export type maskingMode = 'alpha' | 'luminance' | 'match-source'
export type relativeSize = 'larger' | 'smaller'
export type repeatStyle = 'repeat-x' | 'repeat-y' | string
export type shapeBox = box | 'margin-box'
export type singleAnimation =
  | number
  | singleTimingFunction
  | singleAnimationIterationCount
  | singleAnimationDirection
  | singleAnimationFillMode
  | singleAnimationPlayState
  | singleAnimationName
export type singleAnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
export type singleAnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both'
export type singleAnimationIterationCount = number
export type singleAnimationName = 'none' | string
export type singleAnimationPlayState = 'running' | 'paused'
export type singleTimingFunction = singleTransitionTimingFunction
export type singleTransition = singleTransitionTimingFunction | string | number
export type singleTransitionTimingFunction =
  | 'ease'
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'step-start'
  | 'step-end'
  | string
export type singleTransitionProperty = 'all' | string
export type trackBreadth = lengthPercentage | string | 'min-content' | 'max-content' | 'auto'
export type trackSize = trackBreadth | string
export type nonStandardWordBreak = 'break-word'
export type blendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'
export type maskImage = maskReference
export type outlineRadius = borderRadius
export type paint = 'none' | 'currentColor' | Color | string
export type svgLength = string | number
export type svgWritingMode = 'lr-tb' | 'rl-tb' | 'tb-rl' | 'lr' | 'rl' | 'tb'

type CSSPropertyVal<A> = A | 'inherit' | 'initial'
// for functional values
// | ((theme: ThemeObject) => A)
// | ((theme: ThemeObject, props: Object) => A)

export type OriginalCSSPropertySetStrict = {
  alignContent?: CSSPropertyVal<alignContent>
  alignItems?: CSSPropertyVal<alignItems>
  alignSelf?: CSSPropertyVal<alignSelf>
  all?: CSSPropertyVal<all>
  animation?: CSSPropertyVal<animation>
  animationDelay?: CSSPropertyVal<animationDelay>
  animationDirection?: CSSPropertyVal<animationDirection>
  animationDuration?: CSSPropertyVal<animationDuration>
  animationFillMode?: CSSPropertyVal<animationFillMode>
  animationIterationCount?: CSSPropertyVal<animationIterationCount>
  animationName?: CSSPropertyVal<animationName>
  animationPlayState?: CSSPropertyVal<animationPlayState>
  animationTimingFunction?: CSSPropertyVal<animationTimingFunction>
  appearance?: CSSPropertyVal<appearance>
  azimuth?: CSSPropertyVal<azimuth>
  backdropFilter?: CSSPropertyVal<backdropFilter>
  backfaceVisibility?: CSSPropertyVal<backfaceVisibility>
  background?: CSSPropertyVal<background>
  backgroundAttachment?: CSSPropertyVal<backgroundAttachment>
  backgroundBlendMode?: CSSPropertyVal<backgroundBlendMode>
  backgroundClip?: CSSPropertyVal<backgroundClip>
  backgroundColor?: CSSPropertyVal<backgroundColor>
  backgroundImage?: CSSPropertyVal<backgroundImage>
  backgroundOrigin?: CSSPropertyVal<backgroundOrigin>
  backgroundPosition?: CSSPropertyVal<backgroundPosition>
  backgroundPositionX?: CSSPropertyVal<backgroundPositionX>
  backgroundPositionY?: CSSPropertyVal<backgroundPositionY>
  backgroundRepeat?: CSSPropertyVal<backgroundRepeat>
  backgroundSize?: CSSPropertyVal<backgroundSize>
  blockSize?: CSSPropertyVal<blockSize>
  border?: CSSPropertyVal<border>
  borderBlockEnd?: CSSPropertyVal<borderBlockEnd>
  borderBlockEndColor?: CSSPropertyVal<borderBlockEndColor>
  borderBlockEndStyle?: CSSPropertyVal<borderBlockEndStyle>
  borderBlockEndWidth?: CSSPropertyVal<borderBlockEndWidth>
  borderBlockStart?: CSSPropertyVal<borderBlockStart>
  borderBlockStartColor?: CSSPropertyVal<borderBlockStartColor>
  borderBlockStartStyle?: CSSPropertyVal<borderBlockStartStyle>
  borderBlockStartWidth?: CSSPropertyVal<borderBlockStartWidth>
  borderBottom?: CSSPropertyVal<border>
  borderBottomColor?: CSSPropertyVal<Color>
  borderBottomLeftRadius?: CSSPropertyVal<borderBottomLeftRadius>
  borderBottomRightRadius?: CSSPropertyVal<borderBottomRightRadius>
  borderBottomStyle?: CSSPropertyVal<borderBottomStyle>
  borderBottomWidth?: CSSPropertyVal<borderBottomWidth>
  borderCollapse?: CSSPropertyVal<borderCollapse>
  borderColor?: CSSPropertyVal<borderColor>
  borderImage?: CSSPropertyVal<borderImage>
  borderImageOutset?: CSSPropertyVal<borderImageOutset>
  borderImageRepeat?: CSSPropertyVal<borderImageRepeat>
  borderImageSlice?: CSSPropertyVal<borderImageSlice>
  borderImageSource?: CSSPropertyVal<borderImageSource>
  borderImageWidth?: CSSPropertyVal<borderImageWidth>
  borderInlineEnd?: CSSPropertyVal<borderInlineEnd>
  borderInlineEndColor?: CSSPropertyVal<borderInlineEndColor>
  borderInlineEndStyle?: CSSPropertyVal<borderInlineEndStyle>
  borderInlineEndWidth?: CSSPropertyVal<borderInlineEndWidth>
  borderInlineStart?: CSSPropertyVal<borderInlineStart>
  borderInlineStartColor?: CSSPropertyVal<borderInlineStartColor>
  borderInlineStartStyle?: CSSPropertyVal<borderInlineStartStyle>
  borderInlineStartWidth?: CSSPropertyVal<borderInlineStartWidth>
  borderLeft?: CSSPropertyVal<border>
  borderLeftColor?: CSSPropertyVal<borderLeftColor>
  borderLeftStyle?: CSSPropertyVal<borderLeftStyle>
  borderLeftWidth?: CSSPropertyVal<borderLeftWidth>
  borderRadius?: CSSPropertyVal<borderRadius>
  borderRight?: CSSPropertyVal<border>
  borderRightColor?: CSSPropertyVal<borderRightColor>
  borderRightStyle?: CSSPropertyVal<borderRightStyle>
  borderRightWidth?: CSSPropertyVal<borderRightWidth>
  borderSpacing?: CSSPropertyVal<borderSpacing>
  borderStyle?: CSSPropertyVal<borderStyle>
  borderTop?: CSSPropertyVal<border>
  borderTopColor?: CSSPropertyVal<Color>
  borderTopLeftRadius?: CSSPropertyVal<borderTopLeftRadius>
  borderTopRightRadius?: CSSPropertyVal<borderTopRightRadius>
  borderTopStyle?: CSSPropertyVal<borderTopStyle>
  borderTopWidth?: CSSPropertyVal<borderTopWidth>
  borderWidth?: CSSPropertyVal<borderWidth>
  bottom?: CSSPropertyVal<number | string>
  boxAlign?: CSSPropertyVal<boxAlign>
  boxDecorationBreak?: CSSPropertyVal<boxDecorationBreak>
  boxDirection?: CSSPropertyVal<boxDirection>
  boxFlex?: CSSPropertyVal<boxFlex>
  boxFlexGroup?: CSSPropertyVal<boxFlexGroup>
  boxLines?: CSSPropertyVal<boxLines>
  boxOrdinalGroup?: CSSPropertyVal<boxOrdinalGroup>
  boxOrient?: CSSPropertyVal<boxOrient>
  boxPack?: CSSPropertyVal<boxPack>
  boxShadow?: CSSPropertyVal<boxShadow>
  boxSizing?: CSSPropertyVal<boxSizing>
  boxSuppress?: CSSPropertyVal<boxSuppress>
  breakAfter?: CSSPropertyVal<breakAfter>
  breakBefore?: CSSPropertyVal<breakBefore>
  breakInside?: CSSPropertyVal<breakInside>
  captionSide?: CSSPropertyVal<captionSide>
  clear?: CSSPropertyVal<clear>
  clip?: CSSPropertyVal<clip>
  clipPath?: CSSPropertyVal<clipPath>
  color?: CSSPropertyVal<Color>
  columnCount?: CSSPropertyVal<columnCount>
  columnFill?: CSSPropertyVal<columnFill>
  columnGap?: CSSPropertyVal<columnGap>
  columnRule?: CSSPropertyVal<columnRule>
  columnRuleColor?: CSSPropertyVal<columnRuleColor>
  columnRuleStyle?: CSSPropertyVal<columnRuleStyle>
  columnRuleWidth?: CSSPropertyVal<columnRuleWidth>
  columnSpan?: CSSPropertyVal<columnSpan>
  columnWidth?: CSSPropertyVal<columnWidth>
  columns?: CSSPropertyVal<columns>
  contain?: CSSPropertyVal<contain>
  content?: CSSPropertyVal<content>
  counterIncrement?: CSSPropertyVal<counterIncrement>
  counterReset?: CSSPropertyVal<counterReset>
  cursor?: CSSPropertyVal<cursor>
  direction?: CSSPropertyVal<direction>
  display?: CSSPropertyVal<display>
  displayInside?: CSSPropertyVal<displayInside>
  displayList?: CSSPropertyVal<displayList>
  displayOutside?: CSSPropertyVal<displayOutside>
  emptyCells?: CSSPropertyVal<emptyCells>
  filter?: CSSPropertyVal<filter>
  flex?: CSSPropertyVal<flex>
  flexBasis?: CSSPropertyVal<flexBasis>
  flexDirection?: CSSPropertyVal<flexDirection>
  flexFlow?: CSSPropertyVal<flexFlow>
  flexGrow?: CSSPropertyVal<flexGrow>
  flexShrink?: CSSPropertyVal<flexShrink>
  flexWrap?: CSSPropertyVal<flexWrap>
  float?: CSSPropertyVal<float>
  font?: CSSPropertyVal<font>
  fontFamily?: CSSPropertyVal<fontFamily>
  fontFeatureSettings?: CSSPropertyVal<fontFeatureSettings>
  fontKerning?: CSSPropertyVal<fontKerning>
  fontLanguageOverride?: CSSPropertyVal<fontLanguageOverride>
  fontSize?: CSSPropertyVal<fontSize>
  fontSizeAdjust?: CSSPropertyVal<fontSizeAdjust>
  fontStretch?: CSSPropertyVal<fontStretch>
  fontStyle?: CSSPropertyVal<fontStyle>
  fontSynthesis?: CSSPropertyVal<fontSynthesis>
  fontVariant?: CSSPropertyVal<fontVariant>
  fontVariantAlternates?: CSSPropertyVal<fontVariantAlternates>
  fontVariantCaps?: CSSPropertyVal<fontVariantCaps>
  fontVariantEastAsian?: CSSPropertyVal<fontVariantEastAsian>
  fontVariantLigatures?: CSSPropertyVal<fontVariantLigatures>
  fontVariantNumeric?: CSSPropertyVal<fontVariantNumeric>
  fontVariantPosition?: CSSPropertyVal<fontVariantPosition>
  fontWeight?: CSSPropertyVal<fontWeight>
  grid?: CSSPropertyVal<grid>
  gridArea?: CSSPropertyVal<gridArea>
  gridAutoColumns?: CSSPropertyVal<gridAutoColumns>
  gridAutoFlow?: CSSPropertyVal<gridAutoFlow>
  gridAutoRows?: CSSPropertyVal<gridAutoRows>
  gridColumn?: CSSPropertyVal<gridColumn>
  gridColumnEnd?: CSSPropertyVal<gridColumnEnd>
  gridColumnGap?: CSSPropertyVal<gridColumnGap>
  gridColumnStart?: CSSPropertyVal<gridColumnStart>
  gridGap?: CSSPropertyVal<gridGap>
  gridRow?: CSSPropertyVal<gridRow>
  gridRowEnd?: CSSPropertyVal<gridRowEnd>
  gridRowGap?: CSSPropertyVal<gridRowGap>
  gridRowStart?: CSSPropertyVal<gridRowStart>
  gridTemplate?: CSSPropertyVal<gridTemplate>
  gridTemplateAreas?: CSSPropertyVal<gridTemplateAreas>
  gridTemplateColumns?: CSSPropertyVal<gridTemplateColumns>
  gridTemplateRows?: CSSPropertyVal<gridTemplateRows>
  height?: CSSPropertyVal<number | string>
  hyphens?: CSSPropertyVal<hyphens>
  imageOrientation?: CSSPropertyVal<imageOrientation>
  imageRendering?: CSSPropertyVal<imageRendering>
  imageResolution?: CSSPropertyVal<imageResolution>
  imeMode?: CSSPropertyVal<imeMode>
  initialLetter?: CSSPropertyVal<initialLetter>
  initialLetterAlign?: CSSPropertyVal<initialLetterAlign>
  inlineSize?: CSSPropertyVal<inlineSize>
  isolation?: CSSPropertyVal<isolation>
  justifyContent?: CSSPropertyVal<justifyContent>
  left?: CSSPropertyVal<number | string>
  letterSpacing?: CSSPropertyVal<letterSpacing>
  lineBreak?: CSSPropertyVal<lineBreak>
  lineHeight?: CSSPropertyVal<lineHeight>
  listStyle?: CSSPropertyVal<listStyle>
  listStyleImage?: CSSPropertyVal<listStyleImage>
  listStylePosition?: CSSPropertyVal<listStylePosition>
  listStyleType?: CSSPropertyVal<listStyleType>
  margin?: CSSPropertyVal<margin>
  marginBlockEnd?: CSSPropertyVal<marginBlockEnd>
  marginBlockStart?: CSSPropertyVal<marginBlockStart>
  marginBottom?: CSSPropertyVal<marginBottom>
  marginInlineEnd?: CSSPropertyVal<marginInlineEnd>
  marginInlineStart?: CSSPropertyVal<marginInlineStart>
  marginLeft?: CSSPropertyVal<marginLeft>
  marginRight?: CSSPropertyVal<marginRight>
  marginTop?: CSSPropertyVal<marginTop>
  markerOffset?: CSSPropertyVal<markerOffset>
  mask?: CSSPropertyVal<mask>
  maskClip?: CSSPropertyVal<maskClip>
  maskComposite?: CSSPropertyVal<maskComposite>
  maskImage?: CSSPropertyVal<maskImage>
  maskMode?: CSSPropertyVal<maskMode>
  maskOrigin?: CSSPropertyVal<maskOrigin>
  maskPosition?: CSSPropertyVal<maskPosition>
  maskRepeat?: CSSPropertyVal<maskRepeat>
  maskSize?: CSSPropertyVal<maskSize>
  maskType?: CSSPropertyVal<maskType>
  maxBlockSize?: CSSPropertyVal<maxBlockSize>
  maxHeight?: CSSPropertyVal<maxHeight>
  maxInlineSize?: CSSPropertyVal<maxInlineSize>
  maxWidth?: CSSPropertyVal<maxWidth>
  minBlockSize?: CSSPropertyVal<minBlockSize>
  minHeight?: CSSPropertyVal<minHeight>
  minInlineSize?: CSSPropertyVal<minInlineSize>
  minWidth?: CSSPropertyVal<minWidth>
  mixBlendMode?: CSSPropertyVal<mixBlendMode>
  motion?: CSSPropertyVal<motion>
  motionOffset?: CSSPropertyVal<motionOffset>
  motionPath?: CSSPropertyVal<motionPath>
  motionRotation?: CSSPropertyVal<motionRotation>
  objectFit?: CSSPropertyVal<objectFit>
  objectPosition?: CSSPropertyVal<objectPosition>
  offsetBlockEnd?: CSSPropertyVal<offsetBlockEnd>
  offsetBlockStart?: CSSPropertyVal<offsetBlockStart>
  offsetInlineEnd?: CSSPropertyVal<offsetInlineEnd>
  offsetInlineStart?: CSSPropertyVal<offsetInlineStart>
  opacity?: CSSPropertyVal<opacity>
  order?: CSSPropertyVal<order>
  orphans?: CSSPropertyVal<orphans>
  outline?: CSSPropertyVal<outline>
  outlineColor?: CSSPropertyVal<outlineColor>
  outlineOffset?: CSSPropertyVal<outlineOffset>
  outlineStyle?: CSSPropertyVal<outlineStyle>
  outlineWidth?: CSSPropertyVal<outlineWidth>
  overflow?: CSSPropertyVal<overflow>
  overflowClipBox?: CSSPropertyVal<overflowClipBox>
  overflowWrap?: CSSPropertyVal<overflowWrap>
  overflowX?: CSSPropertyVal<overflowX>
  overflowY?: CSSPropertyVal<overflowY>
  padding?: CSSPropertyVal<padding>
  paddingBlockEnd?: CSSPropertyVal<paddingBlockEnd>
  paddingBlockStart?: CSSPropertyVal<paddingBlockStart>
  paddingBottom?: CSSPropertyVal<paddingBottom>
  paddingInlineEnd?: CSSPropertyVal<paddingInlineEnd>
  paddingInlineStart?: CSSPropertyVal<paddingInlineStart>
  paddingLeft?: CSSPropertyVal<paddingLeft>
  paddingRight?: CSSPropertyVal<paddingRight>
  paddingTop?: CSSPropertyVal<paddingTop>
  paddingH?: CSSPropertyVal<number | string>
  paddingV?: CSSPropertyVal<number | string>
  marginH?: CSSPropertyVal<number | string>
  marginV?: CSSPropertyVal<number | string>
  pageBreakAfter?: CSSPropertyVal<pageBreakAfter>
  pageBreakBefore?: CSSPropertyVal<pageBreakBefore>
  pageBreakInside?: CSSPropertyVal<pageBreakInside>
  perspective?: CSSPropertyVal<perspective>
  perspectiveOrigin?: CSSPropertyVal<perspectiveOrigin>
  pointerEvents?: CSSPropertyVal<pointerEvents>
  position?: CSSPropertyVal<position>
  quotes?: CSSPropertyVal<quotes>
  resize?: CSSPropertyVal<resize>
  right?: CSSPropertyVal<number | string>
  rubyAlign?: CSSPropertyVal<rubyAlign>
  rubyMerge?: CSSPropertyVal<rubyMerge>
  rubyPosition?: CSSPropertyVal<rubyPosition>
  scrollBehavior?: CSSPropertyVal<scrollBehavior>
  scrollSnapCoordinate?: CSSPropertyVal<scrollSnapCoordinate>
  scrollSnapDestination?: CSSPropertyVal<scrollSnapDestination>
  scrollSnapPointsX?: CSSPropertyVal<scrollSnapPointsX>
  scrollSnapPointsY?: CSSPropertyVal<scrollSnapPointsY>
  scrollSnapType?: CSSPropertyVal<scrollSnapType>
  scrollSnapTypeX?: CSSPropertyVal<scrollSnapTypeX>
  scrollSnapTypeY?: CSSPropertyVal<scrollSnapTypeY>
  shapeImageThreshold?: CSSPropertyVal<shapeImageThreshold>
  shapeMargin?: CSSPropertyVal<shapeMargin>
  shapeOutside?: CSSPropertyVal<shapeOutside>
  tabSize?: CSSPropertyVal<tabSize>
  tableLayout?: CSSPropertyVal<tableLayout>
  textAlign?: CSSPropertyVal<textAlign>
  textAlignLast?: CSSPropertyVal<textAlignLast>
  textCombineUpright?: CSSPropertyVal<textCombineUpright>
  textDecoration?: CSSPropertyVal<textDecoration>
  textDecorationColor?: CSSPropertyVal<textDecorationColor>
  textDecorationLine?: CSSPropertyVal<textDecorationLine>
  textDecorationSkip?: CSSPropertyVal<textDecorationSkip>
  textDecorationStyle?: CSSPropertyVal<textDecorationStyle>
  textEmphasis?: CSSPropertyVal<textEmphasis>
  textEmphasisColor?: CSSPropertyVal<textEmphasisColor>
  textEmphasisPosition?: CSSPropertyVal<textEmphasisPosition>
  textEmphasisStyle?: CSSPropertyVal<textEmphasisStyle>
  textIndent?: CSSPropertyVal<textIndent>
  textOrientation?: CSSPropertyVal<textOrientation>
  textOverflow?: CSSPropertyVal<textOverflow>
  textRendering?: CSSPropertyVal<textRendering>
  textShadow?: CSSPropertyVal<textShadow>
  textSizeAdjust?: CSSPropertyVal<textSizeAdjust>
  textTransform?: CSSPropertyVal<textTransform>
  textUnderlinePosition?: CSSPropertyVal<textUnderlinePosition>
  top?: CSSPropertyVal<number | string>
  touchAction?: CSSPropertyVal<touchAction>
  transform?: CSSPropertyVal<transform>
  transformBox?: CSSPropertyVal<transformBox>
  transformOrigin?: CSSPropertyVal<transformOrigin>
  transformStyle?: CSSPropertyVal<transformStyle>
  transition?: CSSPropertyVal<transition>
  transitionDelay?: CSSPropertyVal<transitionDelay>
  transitionDuration?: CSSPropertyVal<transitionDuration>
  transitionProperty?: CSSPropertyVal<transitionProperty>
  transitionTimingFunction?: CSSPropertyVal<transitionTimingFunction>
  unicodeBidi?: CSSPropertyVal<unicodeBidi>
  userSelect?: CSSPropertyVal<userSelect>
  verticalAlign?: CSSPropertyVal<verticalAlign>
  visibility?: CSSPropertyVal<visibility>
  whiteSpace?: CSSPropertyVal<whiteSpace>
  widows?: CSSPropertyVal<widows>
  width?: CSSPropertyVal<number | string>
  willChange?: CSSPropertyVal<willChange>
  wordBreak?: CSSPropertyVal<wordBreak>
  wordSpacing?: CSSPropertyVal<wordSpacing>
  wordWrap?: CSSPropertyVal<wordWrap>
  writingMode?: CSSPropertyVal<writingMode>
  zIndex?: CSSPropertyVal<zIndex>
  alignmentBaseline?: CSSPropertyVal<alignmentBaseline>
  baselineShift?: CSSPropertyVal<baselineShift>
  behavior?: CSSPropertyVal<behavior>
  clipRule?: CSSPropertyVal<clipRule>
  cue?: CSSPropertyVal<cue>
  cueAfter?: CSSPropertyVal<cueAfter>
  cueBefore?: CSSPropertyVal<cueBefore>
  dominantBaseline?: CSSPropertyVal<dominantBaseline>
  fill?: CSSPropertyVal<fill>
  fillOpacity?: CSSPropertyVal<fillOpacity>
  fillRule?: CSSPropertyVal<fillRule>
  glyphOrientationHorizontal?: CSSPropertyVal<glyphOrientationHorizontal>
  glyphOrientationVertical?: CSSPropertyVal<glyphOrientationVertical>
  kerning?: CSSPropertyVal<kerning>
  marker?: CSSPropertyVal<marker>
  markerEnd?: CSSPropertyVal<markerEnd>
  markerMid?: CSSPropertyVal<markerMid>
  markerStart?: CSSPropertyVal<markerStart>
  pause?: CSSPropertyVal<pause>
  pauseAfter?: CSSPropertyVal<pauseAfter>
  pauseBefore?: CSSPropertyVal<pauseBefore>
  rest?: CSSPropertyVal<rest>
  restAfter?: CSSPropertyVal<restAfter>
  restBefore?: CSSPropertyVal<restBefore>
  shapeRendering?: CSSPropertyVal<shapeRendering>
  src?: CSSPropertyVal<src>
  speak?: CSSPropertyVal<speak>
  speakAs?: CSSPropertyVal<speakAs>
  stroke?: CSSPropertyVal<stroke>
  strokeDasharray?: CSSPropertyVal<strokeDasharray>
  strokeDashoffset?: CSSPropertyVal<strokeDashoffset>
  strokeLinecap?: CSSPropertyVal<strokeLinecap>
  strokeLinejoin?: CSSPropertyVal<strokeLinejoin>
  strokeMiterlimit?: CSSPropertyVal<strokeMiterlimit>
  strokeOpacity?: CSSPropertyVal<strokeOpacity>
  strokeWidth?: CSSPropertyVal<strokeWidth>
  textAnchor?: CSSPropertyVal<textAnchor>
  unicodeRange?: CSSPropertyVal<unicodeRange>
  voiceBalance?: CSSPropertyVal<voiceBalance>
  voiceDuration?: CSSPropertyVal<voiceDuration>
  voiceFamily?: CSSPropertyVal<voiceFamily>
  voicePitch?: CSSPropertyVal<voicePitch>
  voiceRange?: CSSPropertyVal<voiceRange>
  voiceRate?: CSSPropertyVal<voiceRate>
  voiceStress?: CSSPropertyVal<voiceStress>
  voiceVolume?: CSSPropertyVal<voiceVolume>
  zoom?: CSSPropertyVal<zoom>
  WebkitAppRegion?: string
}

export type CSSPropertySetStrict = OriginalCSSPropertySetStrict & {
  borderLeftRadius?: number
  borderRightRadius?: number
  borderBottomRadius?: number
  borderTopRadius?: number
}

// because we can have `'& > .something': {}` and custom sub-styles like `isActive: {}`
export type CSSPropertySet = CSSPropertySetStrict & {
  [key: string]: CSSPropertySetStrict | any
}
