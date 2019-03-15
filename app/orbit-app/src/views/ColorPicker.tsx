import { gloss } from '@o/gloss'
import { color, Row, View, ViewProps } from '@o/ui'
import React, { memo } from 'react'

const niceColors = [
  ['rgb(17, 17, 17)', 'rgb(127, 219, 255)'],
  ['rgb(17, 17, 17)', 'rgb(0, 116, 217)'],
  ['rgb(17, 17, 17)', 'rgb(1, 255, 112)'],
  ['rgb(17, 17, 17)', 'rgb(57, 204, 204)'],
  ['rgb(17, 17, 17)', 'rgb(61, 153, 112)'],
  ['rgb(17, 17, 17)', 'rgb(46, 204, 64)'],
  ['rgb(17, 17, 17)', 'rgb(255, 65, 54)'],
  ['rgb(17, 17, 17)', 'rgb(255, 133, 27)'],
  ['rgb(17, 17, 17)', 'rgb(177, 13, 201)'],
  ['rgb(17, 17, 17)', 'rgb(255, 220, 0)'],
  ['rgb(17, 17, 17)', 'rgb(240, 18, 190)'],
  ['rgb(17, 17, 17)', 'rgb(170, 170, 170)'],
  ['rgb(17, 17, 17)', 'rgb(255, 255, 255)'],
  ['rgb(17, 17, 17)', 'rgb(221, 221, 221)'],
  ['rgb(255, 255, 255)', 'rgb(0, 116, 217)'],
  ['rgb(255, 255, 255)', 'rgb(0, 31, 63)'],
  ['rgb(255, 255, 255)', 'rgb(61, 153, 112)'],
  ['rgb(255, 255, 255)', 'rgb(255, 65, 54)'],
  ['rgb(255, 255, 255)', 'rgb(133, 20, 75)'],
  ['rgb(255, 255, 255)', 'rgb(177, 13, 201)'],
  ['rgb(255, 255, 255)', 'rgb(240, 18, 190)'],
  ['rgb(255, 255, 255)', 'rgb(17, 17, 17)'],
  ['rgb(221, 221, 221)', 'rgb(0, 116, 217)'],
  ['rgb(221, 221, 221)', 'rgb(0, 31, 63)'],
  ['rgb(221, 221, 221)', 'rgb(133, 20, 75)'],
  ['rgb(221, 221, 221)', 'rgb(255, 255, 255)'],
  ['rgb(221, 221, 221)', 'rgb(17, 17, 17)'],
  ['rgb(170, 170, 170)', 'rgb(0, 31, 63)'],
  ['rgb(170, 170, 170)', 'rgb(133, 20, 75)'],
  ['rgb(170, 170, 170)', 'rgb(17, 17, 17)'],
  ['rgb(240, 18, 190)', 'rgb(0, 31, 63)'],
  ['rgb(240, 18, 190)', 'rgb(255, 255, 255)'],
  ['rgb(240, 18, 190)', 'rgb(17, 17, 17)'],
  ['rgb(255, 220, 0)', 'rgb(177, 13, 201)'],
  ['rgb(255, 220, 0)', 'rgb(133, 20, 75)'],
  ['rgb(255, 220, 0)', 'rgb(0, 31, 63)'],
  ['rgb(255, 220, 0)', 'rgb(0, 116, 217)'],
  ['rgb(255, 220, 0)', 'rgb(17, 17, 17)'],
  ['rgb(177, 13, 201)', 'rgb(1, 255, 112)'],
  ['rgb(177, 13, 201)', 'rgb(221, 221, 221)'],
  ['rgb(177, 13, 201)', 'rgb(17, 17, 17)'],
  ['rgb(177, 13, 201)', 'rgb(255, 255, 255)'],
  ['rgb(177, 13, 201)', 'rgb(255, 220, 0)'],
  ['rgb(255, 133, 27)', 'rgb(133, 20, 75)'],
  ['rgb(255, 133, 27)', 'rgb(0, 31, 63)'],
  ['rgb(255, 133, 27)', 'rgb(17, 17, 17)'],
  ['rgb(133, 20, 75)', 'rgb(1, 255, 112)'],
  ['rgb(133, 20, 75)', 'rgb(127, 219, 255)'],
  ['rgb(133, 20, 75)', 'rgb(46, 204, 64)'],
  ['rgb(133, 20, 75)', 'rgb(255, 133, 27)'],
  ['rgb(133, 20, 75)', 'rgb(255, 220, 0)'],
  ['rgb(133, 20, 75)', 'rgb(170, 170, 170)'],
  ['rgb(133, 20, 75)', 'rgb(255, 255, 255)'],
  ['rgb(133, 20, 75)', 'rgb(221, 221, 221)'],
  ['rgb(255, 65, 54)', 'rgb(0, 31, 63)'],
  ['rgb(255, 65, 54)', 'rgb(255, 255, 255)'],
  ['rgb(255, 65, 54)', 'rgb(17, 17, 17)'],
  ['rgb(127, 219, 255)', 'rgb(0, 31, 63)'],
  ['rgb(127, 219, 255)', 'rgb(133, 20, 75)'],
  ['rgb(127, 219, 255)', 'rgb(240, 18, 190)'],
  ['rgb(127, 219, 255)', 'rgb(17, 17, 17)'],
  ['rgb(0, 116, 217)', 'rgb(1, 255, 112)'],
  ['rgb(0, 116, 217)', 'rgb(0, 31, 63)'],
  ['rgb(0, 116, 217)', 'rgb(255, 220, 0)'],
  ['rgb(0, 116, 217)', 'rgb(255, 255, 255)'],
  ['rgb(0, 116, 217)', 'rgb(17, 17, 17)'],
  ['rgb(0, 116, 217)', 'rgb(221, 221, 221)'],
  ['rgb(0, 31, 63)', 'rgb(0, 116, 217)'],
  ['rgb(0, 31, 63)', 'rgb(127, 219, 255)'],
  ['rgb(0, 31, 63)', 'rgb(61, 153, 112)'],
  ['rgb(0, 31, 63)', 'rgb(46, 204, 64)'],
  ['rgb(0, 31, 63)', 'rgb(1, 255, 112)'],
  ['rgb(0, 31, 63)', 'rgb(255, 65, 54)'],
  ['rgb(0, 31, 63)', 'rgb(255, 133, 27)'],
  ['rgb(0, 31, 63)', 'rgb(255, 220, 0)'],
  ['rgb(0, 31, 63)', 'rgb(240, 18, 190)'],
  ['rgb(0, 31, 63)', 'rgb(170, 170, 170)'],
  ['rgb(0, 31, 63)', 'rgb(221, 221, 221)'],
  ['rgb(0, 31, 63)', 'rgb(255, 255, 255)'],
  ['rgb(57, 204, 204)', 'rgb(0, 31, 63)'],
  ['rgb(57, 204, 204)', 'rgb(133, 20, 75)'],
  ['rgb(57, 204, 204)', 'rgb(17, 17, 17)'],
  ['rgb(1, 255, 112)', 'rgb(0, 116, 217)'],
  ['rgb(1, 255, 112)', 'rgb(0, 31, 63)'],
  ['rgb(1, 255, 112)', 'rgb(133, 20, 75)'],
  ['rgb(1, 255, 112)', 'rgb(240, 18, 190)'],
  ['rgb(1, 255, 112)', 'rgb(17, 17, 17)'],
  ['rgb(61, 153, 112)', 'rgb(0, 31, 63)'],
  ['rgb(61, 153, 112)', 'rgb(255, 255, 255)'],
  ['rgb(61, 153, 112)', 'rgb(17, 17, 17)'],
  ['rgb(46, 204, 64)', 'rgb(0, 31, 63)'],
  ['rgb(46, 204, 64)', 'rgb(17, 17, 17)'],
  ['rgb(46, 204, 64)', 'rgb(133, 20, 75)'],
]

// @ts-ignore
export const ColorPicker = memo(function ColorPicker({
  count = 40,
  luminosity = 'dark',
  hue,
  onChangeColor,
  activeColor,
  size = 32,
  className,
  ...viewProps
}: {
  activeColor?: string
  count?: number
  seed?: number
  luminosity?: string
  hue?: string
  size?: number
  onChangeColor?: (colors: [string, string]) => any
} & ViewProps) {
  const combos = niceColors.slice(0, count)

  return (
    <Row justifyContent="space-around" marginBottom={-5} flexWrap="wrap" className={className}>
      {combos.map((colors, i) => (
        <Squircle
          key={i}
          colors={colors}
          width={size}
          height={size}
          margin={[0, 5, 5, 0]}
          onClick={() => {
            onChangeColor([colors[0], colors[1]])
          }}
          {...viewProps}
        />
      ))}
      <View flex={1} />
    </Row>
  )
})

const SVG = gloss(View)
SVG.defaultProps = {
  tagName: 'svg',
}

export function Squircle({ colors, ...rest }: any) {
  return (
    <SVG width="1024px" height="1024px" viewBox="0 0 1024 1024" {...rest}>
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
          <stop
            stopColor={color(colors[0])
              .lighten(0.05)
              .hex()}
            offset="0%"
          />
          <stop
            stopColor={color(colors[0])
              .darken(0.05)
              .hex()}
            offset="100%"
          />
        </linearGradient>
        <path
          d="M393.978253,0.421875 L579.021747,0.421875 C715.869873,0.421875 765.494311,14.6706063 815.52394,41.426745 C865.55357,68.1828837 904.817116,107.44643 931.573255,157.47606 C958.329394,207.505689 972.578125,257.130127 972.578125,393.978253 L972.578125,579.021747 C972.578125,715.869873 958.329394,765.494311 931.573255,815.52394 C904.817116,865.55357 865.55357,904.817116 815.52394,931.573255 C765.494311,958.329394 715.869873,972.578125 579.021747,972.578125 L393.978253,972.578125 C257.130127,972.578125 207.505689,958.329394 157.47606,931.573255 C107.44643,904.817116 68.1828837,865.55357 41.426745,815.52394 C14.6706063,765.494311 0.421875,715.869873 0.421875,579.021747 L0.421875,393.978253 C0.421875,257.130127 14.6706063,207.505689 41.426745,157.47606 C68.1828837,107.44643 107.44643,68.1828837 157.47606,41.426745 C207.505689,14.6706063 257.130127,0.421875 393.978253,0.421875 Z"
          id="path-2"
        />
      </defs>
      <g id="appicon-search" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="icon" transform="translate(24.000000, 26.000000)">
          <g id="squircle2">
            <g id="Rectangle">
              <use fill="black" fillOpacity="1" filter="url(#filter-3)" />
              <path
                strokeOpacity="0.214787138"
                strokeWidth="6"
                d="M393.978253,3.421875 C327.481005,3.421875 280.308729,6.77440569 243.739038,13.8363388 C211.311278,20.0984281 186.85487,29.1168666 158.890856,44.0721846 C109.384032,70.5487239 70.5487239,109.384032 44.0721846,158.890856 C29.1168666,186.85487 20.0984281,211.311278 13.8363388,243.739038 C6.77440569,280.308729 3.421875,327.481005 3.421875,393.978253 L3.421875,579.021747 C3.421875,645.518995 6.77440569,692.691271 13.8363388,729.260962 C20.0984281,761.688722 29.1168666,786.14513 44.0721846,814.109144 C70.5487239,863.615968 109.384032,902.451276 158.890856,928.927815 C186.85487,943.883133 211.311278,952.901572 243.739038,959.163661 C280.308729,966.225594 327.481005,969.578125 393.978253,969.578125 L579.021747,969.578125 C645.518995,969.578125 692.691271,966.225594 729.260962,959.163661 C761.688722,952.901572 786.14513,943.883133 814.109144,928.927815 C863.615968,902.451276 902.451276,863.615968 928.927815,814.109144 C943.883133,786.14513 952.901572,761.688722 959.163661,729.260962 C966.225594,692.691271 969.578125,645.518995 969.578125,579.021747 L969.578125,393.978253 C969.578125,327.481005 966.225594,280.308729 959.163661,243.739038 C952.901572,211.311278 943.883133,186.85487 928.927815,158.890856 C902.451276,109.384032 863.615968,70.5487239 814.109144,44.0721846 C786.14513,29.1168666 761.688722,20.0984281 729.260962,13.8363388 C692.691271,6.77440569 645.518995,3.421875 579.021747,3.421875 L393.978253,3.421875 Z"
                fill={colors[0]}
                // strokeLinejoin="square"
                // fill="url(#linearGradient-1)"
                fillRule="evenodd"
              />
            </g>
          </g>
        </g>
        <circle id="icon-list" fill={colors[1]} cx="512" cy="512" r="333" />
      </g>
    </SVG>
  )
}
