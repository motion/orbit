import { ColorLike } from '@o/color'

import { ThemeObject } from './ThemeObject'

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
export type alignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch' | 'start'
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
  color?: ColorLike
  image?: bgImage
  position?: string
  repeat?: repeatStyle
}
export type background = string | number[] | finalBgLayer | backgroundSyntax | ColorLike
export type backgroundAttachment = attachment
export type backgroundBlendMode = blendMode
export type backgroundClip = box
export type backgroundColor = ColorLike
export type backgroundImage = bgImage
export type backgroundOrigin = box
export type backgroundPosition = string
export type backgroundPositionX = string
export type backgroundPositionY = string
export type backgroundRepeat = repeatStyle
export type backgroundSize = bgSize
export type blockSize = width
type borderSyntax = (number | string | ColorLike)[]
export type border = borderWidth | brStyle | ColorLike | borderSyntax
export type borderBlockEnd = borderWidth | borderStyle | ColorLike
export type borderBlockEndColor = ColorLike
export type borderBlockEndStyle = borderStyle
export type borderBlockEndWidth = borderWidth
export type borderBlockStart = borderWidth | borderStyle | ColorLike
export type borderBlockStartColor = ColorLike
export type borderBlockStartStyle = borderStyle
export type borderBlockStartWidth = borderWidth
export type borderBottomLeftRadius = lengthPercentage
export type borderBottomRightRadius = lengthPercentage
export type borderBottomStyle = brStyle
export type borderBottomWidth = borderWidth
export type borderCollapse = 'collapse' | 'separate'
export type borderColor = ColorLike | (number | string | ColorLike)[]
export type borderImage = borderImageSource | borderImageSlice | string | borderImageRepeat
export type borderImageOutset = string
export type borderImageRepeat = string
export type borderImageSlice = string | number | 'fill'
export type borderImageSource = 'none' | string
export type borderImageWidth = string
export type borderInlineEnd = borderWidth | borderStyle | ColorLike
export type borderInlineEndColor = ColorLike
export type borderInlineEndStyle = borderStyle
export type borderInlineEndWidth = borderWidth
export type borderInlineStart = borderWidth | borderStyle | ColorLike
export type borderInlineStartColor = ColorLike
export type borderInlineStartStyle = borderStyle
export type borderInlineStartWidth = borderWidth
export type borderLeftColor = ColorLike
export type borderLeftStyle = brStyle
export type borderLeftWidth = borderWidth
export type borderRightColor = ColorLike
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
export type boxShadowSyntax = {
  x?: number
  y?: number
  blur?: number
  spread?: number
  color?: ColorLike
  inset?: boolean
}

export type boxShadowItem =
  | boxShadowSyntax
  | (number | ColorLike)[]
  | (number | ColorLike | string)[]

export type boxShadow = 'none' | number | string | boxShadowItem[]
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
export type columnRuleColor = ColorLike
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
  | '-webkit-box'
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
type marginSyntax = (number | string)[]
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
  color?: ColorLike
}
export type outline = string | outlineSyntax
export type outlineColor = ColorLike | 'invert'
export type outlineOffset = number
export type outlineStyle = 'auto' | brStyle
export type outlineWidth = borderWidth
export type overflow = 'visible' | 'hidden' | 'scroll' | 'auto'
export type overflowClipBox = 'padding-box' | 'content-box'
export type overflowWrap = 'normal' | 'break-word'
export type overflowX = 'visible' | 'hidden' | 'scroll' | 'auto'
export type overflowY = 'visible' | 'hidden' | 'scroll' | 'auto'
type paddingSyntax = (number | string)[]
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
export type perspective = 'none' | string | number
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
export type textDecorationColor = ColorLike
export type textDecorationLine = 'none' | string
export type textDecorationSkip = 'none' | string
export type textDecorationStyle = 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy'
export type textEmphasis = textEmphasisStyle | textEmphasisColor
export type textEmphasisColor = ColorLike
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
  rotateX?: string
  rotateY?: string
  rotateZ?: string
  rotate3d?: string
  scale?: number | string
  scaleX?: number | string
  scaleY?: number | string
  scaleZ?: number | string
  skew?: number | string
  skewX?: number | string
  skewY?: number | string
  matrix?: string
  matrix3d?: string
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
  | (singleTransition | transitionSyntax)[]
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
export type paint = 'none' | 'currentColor' | ColorLike | string
export type svgLength = string | number
export type svgWritingMode = 'lr-tb' | 'rl-tb' | 'tb-rl' | 'lr' | 'rl' | 'tb'

// allows functional or non-functional
type CSSPropertyVal<Val, IsFunctional> = IsFunctional extends false
  ? Val | 'inherit' | 'initial' | false
  :
      | Val
      | 'inherit'
      | 'initial'
      | false
      | ((theme: ThemeObject) => Val)
      | ((theme: ThemeObject, props: any) => Val)

export type GenerateCSSPropertySet<A extends true | false> = {
  alignContent?: CSSPropertyVal<alignContent, A>
  alignItems?: CSSPropertyVal<alignItems, A>
  alignSelf?: CSSPropertyVal<alignSelf, A>
  all?: CSSPropertyVal<all, A>
  animation?: CSSPropertyVal<animation, A>
  animationDelay?: CSSPropertyVal<animationDelay, A>
  animationDirection?: CSSPropertyVal<animationDirection, A>
  animationDuration?: CSSPropertyVal<animationDuration, A>
  animationFillMode?: CSSPropertyVal<animationFillMode, A>
  animationIterationCount?: CSSPropertyVal<animationIterationCount, A>
  animationName?: CSSPropertyVal<animationName, A>
  animationPlayState?: CSSPropertyVal<animationPlayState, A>
  animationTimingFunction?: CSSPropertyVal<animationTimingFunction, A>
  appearance?: CSSPropertyVal<appearance, A>
  azimuth?: CSSPropertyVal<azimuth, A>
  backdropFilter?: CSSPropertyVal<backdropFilter, A>
  backfaceVisibility?: CSSPropertyVal<backfaceVisibility, A>
  background?: CSSPropertyVal<background, A>
  backgroundAttachment?: CSSPropertyVal<backgroundAttachment, A>
  backgroundBlendMode?: CSSPropertyVal<backgroundBlendMode, A>
  backgroundClip?: CSSPropertyVal<backgroundClip, A>
  backgroundColor?: CSSPropertyVal<backgroundColor, A>
  backgroundImage?: CSSPropertyVal<backgroundImage, A>
  backgroundOrigin?: CSSPropertyVal<backgroundOrigin, A>
  backgroundPosition?: CSSPropertyVal<backgroundPosition, A>
  backgroundPositionX?: CSSPropertyVal<backgroundPositionX, A>
  backgroundPositionY?: CSSPropertyVal<backgroundPositionY, A>
  backgroundRepeat?: CSSPropertyVal<backgroundRepeat, A>
  backgroundSize?: CSSPropertyVal<backgroundSize, A>
  blockSize?: CSSPropertyVal<blockSize, A>
  border?: CSSPropertyVal<border, A>
  borderBlockEnd?: CSSPropertyVal<borderBlockEnd, A>
  borderBlockEndColor?: CSSPropertyVal<borderBlockEndColor, A>
  borderBlockEndStyle?: CSSPropertyVal<borderBlockEndStyle, A>
  borderBlockEndWidth?: CSSPropertyVal<borderBlockEndWidth, A>
  borderBlockStart?: CSSPropertyVal<borderBlockStart, A>
  borderBlockStartColor?: CSSPropertyVal<borderBlockStartColor, A>
  borderBlockStartStyle?: CSSPropertyVal<borderBlockStartStyle, A>
  borderBlockStartWidth?: CSSPropertyVal<borderBlockStartWidth, A>
  borderBottom?: CSSPropertyVal<border, A>
  borderBottomColor?: CSSPropertyVal<ColorLike, A>
  borderBottomLeftRadius?: CSSPropertyVal<borderBottomLeftRadius, A>
  borderBottomRightRadius?: CSSPropertyVal<borderBottomRightRadius, A>
  borderBottomStyle?: CSSPropertyVal<borderBottomStyle, A>
  borderBottomWidth?: CSSPropertyVal<borderBottomWidth, A>
  borderCollapse?: CSSPropertyVal<borderCollapse, A>
  borderColor?: CSSPropertyVal<borderColor, A>
  borderImage?: CSSPropertyVal<borderImage, A>
  borderImageOutset?: CSSPropertyVal<borderImageOutset, A>
  borderImageRepeat?: CSSPropertyVal<borderImageRepeat, A>
  borderImageSlice?: CSSPropertyVal<borderImageSlice, A>
  borderImageSource?: CSSPropertyVal<borderImageSource, A>
  borderImageWidth?: CSSPropertyVal<borderImageWidth, A>
  borderInlineEnd?: CSSPropertyVal<borderInlineEnd, A>
  borderInlineEndColor?: CSSPropertyVal<borderInlineEndColor, A>
  borderInlineEndStyle?: CSSPropertyVal<borderInlineEndStyle, A>
  borderInlineEndWidth?: CSSPropertyVal<borderInlineEndWidth, A>
  borderInlineStart?: CSSPropertyVal<borderInlineStart, A>
  borderInlineStartColor?: CSSPropertyVal<borderInlineStartColor, A>
  borderInlineStartStyle?: CSSPropertyVal<borderInlineStartStyle, A>
  borderInlineStartWidth?: CSSPropertyVal<borderInlineStartWidth, A>
  borderLeft?: CSSPropertyVal<border, A>
  borderLeftColor?: CSSPropertyVal<borderLeftColor, A>
  borderLeftStyle?: CSSPropertyVal<borderLeftStyle, A>
  borderLeftWidth?: CSSPropertyVal<borderLeftWidth, A>
  borderRadius?: CSSPropertyVal<borderRadius, A>
  borderRight?: CSSPropertyVal<border, A>
  borderRightColor?: CSSPropertyVal<borderRightColor, A>
  borderRightStyle?: CSSPropertyVal<borderRightStyle, A>
  borderRightWidth?: CSSPropertyVal<borderRightWidth, A>
  borderSpacing?: CSSPropertyVal<borderSpacing, A>
  borderStyle?: CSSPropertyVal<borderStyle, A>
  borderTop?: CSSPropertyVal<border, A>
  borderTopColor?: CSSPropertyVal<ColorLike, A>
  borderTopLeftRadius?: CSSPropertyVal<borderTopLeftRadius, A>
  borderTopRightRadius?: CSSPropertyVal<borderTopRightRadius, A>
  borderTopStyle?: CSSPropertyVal<borderTopStyle, A>
  borderTopWidth?: CSSPropertyVal<borderTopWidth, A>
  borderWidth?: CSSPropertyVal<borderWidth, A>
  bottom?: CSSPropertyVal<number | string, A>
  boxAlign?: CSSPropertyVal<boxAlign, A>
  boxDecorationBreak?: CSSPropertyVal<boxDecorationBreak, A>
  boxDirection?: CSSPropertyVal<boxDirection, A>
  boxFlex?: CSSPropertyVal<boxFlex, A>
  boxFlexGroup?: CSSPropertyVal<boxFlexGroup, A>
  boxLines?: CSSPropertyVal<boxLines, A>
  boxOrdinalGroup?: CSSPropertyVal<boxOrdinalGroup, A>
  boxOrient?: CSSPropertyVal<boxOrient, A>
  boxPack?: CSSPropertyVal<boxPack, A>
  boxShadow?: CSSPropertyVal<boxShadow, A>
  boxSizing?: CSSPropertyVal<boxSizing, A>
  boxSuppress?: CSSPropertyVal<boxSuppress, A>
  breakAfter?: CSSPropertyVal<breakAfter, A>
  breakBefore?: CSSPropertyVal<breakBefore, A>
  breakInside?: CSSPropertyVal<breakInside, A>
  captionSide?: CSSPropertyVal<captionSide, A>
  clear?: CSSPropertyVal<clear, A>
  clip?: CSSPropertyVal<clip, A>
  clipPath?: CSSPropertyVal<clipPath, A>
  color?: CSSPropertyVal<ColorLike, A>
  columnCount?: CSSPropertyVal<columnCount, A>
  columnFill?: CSSPropertyVal<columnFill, A>
  columnGap?: CSSPropertyVal<columnGap, A>
  columnRule?: CSSPropertyVal<columnRule, A>
  columnRuleColor?: CSSPropertyVal<columnRuleColor, A>
  columnRuleStyle?: CSSPropertyVal<columnRuleStyle, A>
  columnRuleWidth?: CSSPropertyVal<columnRuleWidth, A>
  columnSpan?: CSSPropertyVal<columnSpan, A>
  columnWidth?: CSSPropertyVal<columnWidth, A>
  columns?: CSSPropertyVal<columns, A>
  contain?: CSSPropertyVal<contain, A>
  content?: CSSPropertyVal<content, A>
  counterIncrement?: CSSPropertyVal<counterIncrement, A>
  counterReset?: CSSPropertyVal<counterReset, A>
  cursor?: CSSPropertyVal<cursor, A>
  direction?: CSSPropertyVal<direction, A>
  display?: CSSPropertyVal<display, A>
  displayInside?: CSSPropertyVal<displayInside, A>
  displayList?: CSSPropertyVal<displayList, A>
  displayOutside?: CSSPropertyVal<displayOutside, A>
  emptyCells?: CSSPropertyVal<emptyCells, A>
  filter?: CSSPropertyVal<filter, A>
  flex?: CSSPropertyVal<flex, A>
  flexBasis?: CSSPropertyVal<flexBasis, A>
  flexDirection?: CSSPropertyVal<flexDirection, A>
  flexFlow?: CSSPropertyVal<flexFlow, A>
  flexGrow?: CSSPropertyVal<flexGrow, A>
  flexShrink?: CSSPropertyVal<flexShrink, A>
  flexWrap?: CSSPropertyVal<flexWrap, A>
  float?: CSSPropertyVal<float, A>
  font?: CSSPropertyVal<font, A>
  fontFamily?: CSSPropertyVal<fontFamily, A>
  fontFeatureSettings?: CSSPropertyVal<fontFeatureSettings, A>
  fontKerning?: CSSPropertyVal<fontKerning, A>
  fontLanguageOverride?: CSSPropertyVal<fontLanguageOverride, A>
  fontSize?: CSSPropertyVal<fontSize, A>
  fontSizeAdjust?: CSSPropertyVal<fontSizeAdjust, A>
  fontStretch?: CSSPropertyVal<fontStretch, A>
  fontStyle?: CSSPropertyVal<fontStyle, A>
  fontSynthesis?: CSSPropertyVal<fontSynthesis, A>
  fontVariant?: CSSPropertyVal<fontVariant, A>
  fontVariantAlternates?: CSSPropertyVal<fontVariantAlternates, A>
  fontVariantCaps?: CSSPropertyVal<fontVariantCaps, A>
  fontVariantEastAsian?: CSSPropertyVal<fontVariantEastAsian, A>
  fontVariantLigatures?: CSSPropertyVal<fontVariantLigatures, A>
  fontVariantNumeric?: CSSPropertyVal<fontVariantNumeric, A>
  fontVariantPosition?: CSSPropertyVal<fontVariantPosition, A>
  fontWeight?: CSSPropertyVal<fontWeight, A>
  grid?: CSSPropertyVal<grid, A>
  gridArea?: CSSPropertyVal<gridArea, A>
  gridAutoColumns?: CSSPropertyVal<gridAutoColumns, A>
  gridAutoFlow?: CSSPropertyVal<gridAutoFlow, A>
  gridAutoRows?: CSSPropertyVal<gridAutoRows, A>
  gridColumn?: CSSPropertyVal<gridColumn, A>
  gridColumnEnd?: CSSPropertyVal<gridColumnEnd, A>
  gridColumnGap?: CSSPropertyVal<gridColumnGap, A>
  gridColumnStart?: CSSPropertyVal<gridColumnStart, A>
  gridGap?: CSSPropertyVal<gridGap, A>
  gridRow?: CSSPropertyVal<gridRow, A>
  gridRowEnd?: CSSPropertyVal<gridRowEnd, A>
  gridRowGap?: CSSPropertyVal<gridRowGap, A>
  gridRowStart?: CSSPropertyVal<gridRowStart, A>
  gridTemplate?: CSSPropertyVal<gridTemplate, A>
  gridTemplateAreas?: CSSPropertyVal<gridTemplateAreas, A>
  gridTemplateColumns?: CSSPropertyVal<gridTemplateColumns, A>
  gridTemplateRows?: CSSPropertyVal<gridTemplateRows, A>
  height?: CSSPropertyVal<number | string, A>
  hyphens?: CSSPropertyVal<hyphens, A>
  imageOrientation?: CSSPropertyVal<imageOrientation, A>
  imageRendering?: CSSPropertyVal<imageRendering, A>
  imageResolution?: CSSPropertyVal<imageResolution, A>
  imeMode?: CSSPropertyVal<imeMode, A>
  initialLetter?: CSSPropertyVal<initialLetter, A>
  initialLetterAlign?: CSSPropertyVal<initialLetterAlign, A>
  inlineSize?: CSSPropertyVal<inlineSize, A>
  isolation?: CSSPropertyVal<isolation, A>
  justifyContent?: CSSPropertyVal<justifyContent, A>
  left?: CSSPropertyVal<number | string, A>
  letterSpacing?: CSSPropertyVal<letterSpacing, A>
  lineBreak?: CSSPropertyVal<lineBreak, A>
  lineHeight?: CSSPropertyVal<lineHeight, A>
  listStyle?: CSSPropertyVal<listStyle, A>
  listStyleImage?: CSSPropertyVal<listStyleImage, A>
  listStylePosition?: CSSPropertyVal<listStylePosition, A>
  listStyleType?: CSSPropertyVal<listStyleType, A>
  margin?: CSSPropertyVal<margin, A>
  marginBlockEnd?: CSSPropertyVal<marginBlockEnd, A>
  marginBlockStart?: CSSPropertyVal<marginBlockStart, A>
  marginBottom?: CSSPropertyVal<marginBottom, A>
  marginInlineEnd?: CSSPropertyVal<marginInlineEnd, A>
  marginInlineStart?: CSSPropertyVal<marginInlineStart, A>
  marginLeft?: CSSPropertyVal<marginLeft, A>
  marginRight?: CSSPropertyVal<marginRight, A>
  marginTop?: CSSPropertyVal<marginTop, A>
  markerOffset?: CSSPropertyVal<markerOffset, A>
  mask?: CSSPropertyVal<mask, A>
  maskClip?: CSSPropertyVal<maskClip, A>
  maskComposite?: CSSPropertyVal<maskComposite, A>
  maskImage?: CSSPropertyVal<maskImage, A>
  maskMode?: CSSPropertyVal<maskMode, A>
  maskOrigin?: CSSPropertyVal<maskOrigin, A>
  maskPosition?: CSSPropertyVal<maskPosition, A>
  maskRepeat?: CSSPropertyVal<maskRepeat, A>
  maskSize?: CSSPropertyVal<maskSize, A>
  maskType?: CSSPropertyVal<maskType, A>
  maxBlockSize?: CSSPropertyVal<maxBlockSize, A>
  maxHeight?: CSSPropertyVal<maxHeight, A>
  maxInlineSize?: CSSPropertyVal<maxInlineSize, A>
  maxWidth?: CSSPropertyVal<maxWidth, A>
  minBlockSize?: CSSPropertyVal<minBlockSize, A>
  minHeight?: CSSPropertyVal<minHeight, A>
  minInlineSize?: CSSPropertyVal<minInlineSize, A>
  minWidth?: CSSPropertyVal<minWidth, A>
  mixBlendMode?: CSSPropertyVal<mixBlendMode, A>
  motion?: CSSPropertyVal<motion, A>
  motionOffset?: CSSPropertyVal<motionOffset, A>
  motionPath?: CSSPropertyVal<motionPath, A>
  motionRotation?: CSSPropertyVal<motionRotation, A>
  objectFit?: CSSPropertyVal<objectFit, A>
  objectPosition?: CSSPropertyVal<objectPosition, A>
  offsetBlockEnd?: CSSPropertyVal<offsetBlockEnd, A>
  offsetBlockStart?: CSSPropertyVal<offsetBlockStart, A>
  offsetInlineEnd?: CSSPropertyVal<offsetInlineEnd, A>
  offsetInlineStart?: CSSPropertyVal<offsetInlineStart, A>
  opacity?: CSSPropertyVal<opacity, A>
  order?: CSSPropertyVal<order, A>
  orphans?: CSSPropertyVal<orphans, A>
  outline?: CSSPropertyVal<outline, A>
  outlineColor?: CSSPropertyVal<outlineColor, A>
  outlineOffset?: CSSPropertyVal<outlineOffset, A>
  outlineStyle?: CSSPropertyVal<outlineStyle, A>
  outlineWidth?: CSSPropertyVal<outlineWidth, A>
  overflow?: CSSPropertyVal<overflow, A>
  overflowClipBox?: CSSPropertyVal<overflowClipBox, A>
  overflowWrap?: CSSPropertyVal<overflowWrap, A>
  overflowX?: CSSPropertyVal<overflowX, A>
  overflowY?: CSSPropertyVal<overflowY, A>
  padding?: CSSPropertyVal<padding, A>
  paddingBlockEnd?: CSSPropertyVal<paddingBlockEnd, A>
  paddingBlockStart?: CSSPropertyVal<paddingBlockStart, A>
  paddingBottom?: CSSPropertyVal<paddingBottom, A>
  paddingInlineEnd?: CSSPropertyVal<paddingInlineEnd, A>
  paddingInlineStart?: CSSPropertyVal<paddingInlineStart, A>
  paddingLeft?: CSSPropertyVal<paddingLeft, A>
  paddingRight?: CSSPropertyVal<paddingRight, A>
  paddingTop?: CSSPropertyVal<paddingTop, A>
  paddingH?: CSSPropertyVal<number | string, A>
  paddingV?: CSSPropertyVal<number | string, A>
  marginH?: CSSPropertyVal<number | string, A>
  marginV?: CSSPropertyVal<number | string, A>
  pageBreakAfter?: CSSPropertyVal<pageBreakAfter, A>
  pageBreakBefore?: CSSPropertyVal<pageBreakBefore, A>
  pageBreakInside?: CSSPropertyVal<pageBreakInside, A>
  perspective?: CSSPropertyVal<perspective, A>
  perspectiveOrigin?: CSSPropertyVal<perspectiveOrigin, A>
  pointerEvents?: CSSPropertyVal<pointerEvents, A>
  position?: CSSPropertyVal<position, A>
  quotes?: CSSPropertyVal<quotes, A>
  resize?: CSSPropertyVal<resize, A>
  right?: CSSPropertyVal<number | string, A>
  rubyAlign?: CSSPropertyVal<rubyAlign, A>
  rubyMerge?: CSSPropertyVal<rubyMerge, A>
  rubyPosition?: CSSPropertyVal<rubyPosition, A>
  scrollBehavior?: CSSPropertyVal<scrollBehavior, A>
  scrollSnapCoordinate?: CSSPropertyVal<scrollSnapCoordinate, A>
  scrollSnapDestination?: CSSPropertyVal<scrollSnapDestination, A>
  scrollSnapPointsX?: CSSPropertyVal<scrollSnapPointsX, A>
  scrollSnapPointsY?: CSSPropertyVal<scrollSnapPointsY, A>
  scrollSnapType?: CSSPropertyVal<scrollSnapType, A>
  scrollSnapTypeX?: CSSPropertyVal<scrollSnapTypeX, A>
  scrollSnapTypeY?: CSSPropertyVal<scrollSnapTypeY, A>
  shapeImageThreshold?: CSSPropertyVal<shapeImageThreshold, A>
  shapeMargin?: CSSPropertyVal<shapeMargin, A>
  shapeOutside?: CSSPropertyVal<shapeOutside, A>
  tabSize?: CSSPropertyVal<tabSize, A>
  tableLayout?: CSSPropertyVal<tableLayout, A>
  textAlign?: CSSPropertyVal<textAlign, A>
  textAlignLast?: CSSPropertyVal<textAlignLast, A>
  textCombineUpright?: CSSPropertyVal<textCombineUpright, A>
  textDecoration?: CSSPropertyVal<textDecoration, A>
  textDecorationColor?: CSSPropertyVal<textDecorationColor, A>
  textDecorationLine?: CSSPropertyVal<textDecorationLine, A>
  textDecorationSkip?: CSSPropertyVal<textDecorationSkip, A>
  textDecorationStyle?: CSSPropertyVal<textDecorationStyle, A>
  textEmphasis?: CSSPropertyVal<textEmphasis, A>
  textEmphasisColor?: CSSPropertyVal<textEmphasisColor, A>
  textEmphasisPosition?: CSSPropertyVal<textEmphasisPosition, A>
  textEmphasisStyle?: CSSPropertyVal<textEmphasisStyle, A>
  textIndent?: CSSPropertyVal<textIndent, A>
  textOrientation?: CSSPropertyVal<textOrientation, A>
  textOverflow?: CSSPropertyVal<textOverflow, A>
  textRendering?: CSSPropertyVal<textRendering, A>
  textShadow?: CSSPropertyVal<textShadow, A>
  textSizeAdjust?: CSSPropertyVal<textSizeAdjust, A>
  textTransform?: CSSPropertyVal<textTransform, A>
  textUnderlinePosition?: CSSPropertyVal<textUnderlinePosition, A>
  top?: CSSPropertyVal<number | string, A>
  touchAction?: CSSPropertyVal<touchAction, A>
  transform?: CSSPropertyVal<transform, A>
  transformBox?: CSSPropertyVal<transformBox, A>
  transformOrigin?: CSSPropertyVal<transformOrigin, A>
  transformStyle?: CSSPropertyVal<transformStyle, A>
  transition?: CSSPropertyVal<transition, A>
  transitionDelay?: CSSPropertyVal<transitionDelay, A>
  transitionDuration?: CSSPropertyVal<transitionDuration, A>
  transitionProperty?: CSSPropertyVal<transitionProperty, A>
  transitionTimingFunction?: CSSPropertyVal<transitionTimingFunction, A>
  unicodeBidi?: CSSPropertyVal<unicodeBidi, A>
  userSelect?: CSSPropertyVal<userSelect, A>
  verticalAlign?: CSSPropertyVal<verticalAlign, A>
  visibility?: CSSPropertyVal<visibility, A>
  whiteSpace?: CSSPropertyVal<whiteSpace, A>
  widows?: CSSPropertyVal<widows, A>
  width?: CSSPropertyVal<number | string, A>
  willChange?: CSSPropertyVal<willChange, A>
  wordBreak?: CSSPropertyVal<wordBreak, A>
  wordSpacing?: CSSPropertyVal<wordSpacing, A>
  wordWrap?: CSSPropertyVal<wordWrap, A>
  writingMode?: CSSPropertyVal<writingMode, A>
  zIndex?: CSSPropertyVal<zIndex, A>
  alignmentBaseline?: CSSPropertyVal<alignmentBaseline, A>
  baselineShift?: CSSPropertyVal<baselineShift, A>
  behavior?: CSSPropertyVal<behavior, A>
  clipRule?: CSSPropertyVal<clipRule, A>
  cue?: CSSPropertyVal<cue, A>
  cueAfter?: CSSPropertyVal<cueAfter, A>
  cueBefore?: CSSPropertyVal<cueBefore, A>
  dominantBaseline?: CSSPropertyVal<dominantBaseline, A>
  fill?: CSSPropertyVal<fill, A>
  fillOpacity?: CSSPropertyVal<fillOpacity, A>
  fillRule?: CSSPropertyVal<fillRule, A>
  glyphOrientationHorizontal?: CSSPropertyVal<glyphOrientationHorizontal, A>
  glyphOrientationVertical?: CSSPropertyVal<glyphOrientationVertical, A>
  kerning?: CSSPropertyVal<kerning, A>
  marker?: CSSPropertyVal<marker, A>
  markerEnd?: CSSPropertyVal<markerEnd, A>
  markerMid?: CSSPropertyVal<markerMid, A>
  markerStart?: CSSPropertyVal<markerStart, A>
  pause?: CSSPropertyVal<pause, A>
  pauseAfter?: CSSPropertyVal<pauseAfter, A>
  pauseBefore?: CSSPropertyVal<pauseBefore, A>
  rest?: CSSPropertyVal<rest, A>
  restAfter?: CSSPropertyVal<restAfter, A>
  restBefore?: CSSPropertyVal<restBefore, A>
  shapeRendering?: CSSPropertyVal<shapeRendering, A>
  src?: CSSPropertyVal<src, A>
  speak?: CSSPropertyVal<speak, A>
  speakAs?: CSSPropertyVal<speakAs, A>
  stroke?: CSSPropertyVal<stroke, A>
  strokeDasharray?: CSSPropertyVal<strokeDasharray, A>
  strokeDashoffset?: CSSPropertyVal<strokeDashoffset, A>
  strokeLinecap?: CSSPropertyVal<strokeLinecap, A>
  strokeLinejoin?: CSSPropertyVal<strokeLinejoin, A>
  strokeMiterlimit?: CSSPropertyVal<strokeMiterlimit, A>
  strokeOpacity?: CSSPropertyVal<strokeOpacity, A>
  strokeWidth?: CSSPropertyVal<strokeWidth, A>
  textAnchor?: CSSPropertyVal<textAnchor, A>
  unicodeRange?: CSSPropertyVal<unicodeRange, A>
  voiceBalance?: CSSPropertyVal<voiceBalance, A>
  voiceDuration?: CSSPropertyVal<voiceDuration, A>
  voiceFamily?: CSSPropertyVal<voiceFamily, A>
  voicePitch?: CSSPropertyVal<voicePitch, A>
  voiceRange?: CSSPropertyVal<voiceRange, A>
  voiceRate?: CSSPropertyVal<voiceRate, A>
  voiceStress?: CSSPropertyVal<voiceStress, A>
  voiceVolume?: CSSPropertyVal<voiceVolume, A>
  zoom?: CSSPropertyVal<zoom, A>
  WebkitAppRegion?: string
}

export type GlossCSSProperties = {
  borderLeftRadius?: number
  borderRightRadius?: number
  borderBottomRadius?: number
  borderTopRadius?: number
}

export type GlossPropertySetFunctional = GenerateCSSPropertySet<true> & GlossCSSProperties
export type GlossPropertySet = GenerateCSSPropertySet<false> & GlossCSSProperties

// because we can have `'& > .something': {}` and custom sub-styles like `isActive: {}`
export type CSSPropertySetStrict = GlossPropertySetFunctional

export type CSSPropertySet = GlossPropertySetFunctional & {
  [key: string]: GlossPropertySet | any
}

export type CSSPropertySetResolved = GlossPropertySetFunctional & {
  [key: string]: GlossPropertySet | any
}

export type CSSPropertySetLoose = {
  [P in keyof CSSPropertySetStrict]?: CSSPropertySetStrict[P] | any
} & {
  [key: string]: GlossPropertySet | any
}
