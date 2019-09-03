import { View, ViewProps } from '@o/ui'
import { gloss, useTheme } from 'gloss'
import React, { memo } from 'react'

import { useLink } from '../useLink'

const orbit = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1441px" height="372px" viewBox="0 0 1441 372" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 56.3 (81716) - https://sketch.com -->
    <title>logomark-solid</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-1016.000000, -756.000000)">
            <g id="orbit-logo" transform="translate(1005.000000, 721.000000)">
                <g id="Group-2" transform="translate(215.000000, 135.000000)" fill="#000000">
                    <polygon id="BIT" points="1007.21178 1 830 1 830 58.9835309 887.429745 58.9835309 887.429745 228.591641 949.782039 228.591641 949.782039 58.9835309 1007.21178 58.9835309"></polygon>
                    <polygon id="Path" points="794.352294 1 726 1 726 228.591641 794.352294 228.591641"></polygon>
                    <path d="M635.05272,228.127483 C634.96329,228.418865 634.874102,228.709704 634.785156,229 L507.146256,229 L507.008563,12.2910787 C507.231944,6.42591782 511.799292,1.66188167 517.67624,1 L613.210938,1 C648.460296,1.114212 677,29.7242034 677,65 C677,82.6763443 669.833935,98.6789646 658.248479,110.261188 C676.687521,121.489413 689,141.775796 689,164.936805 C689,196.850526 665.623178,223.306402 635.05272,228.127483 Z M604.904762,140.005986 L604.904762,140 L563,140 L563,177.142857 L604.904762,177.142857 L604.904762,177.136871 C614.941409,176.884265 623,168.668939 623,158.571429 C623,148.473918 614.941409,140.258592 604.904762,140.005986 Z M603.904762,53.0058362 L603.904762,53 L562,53 L562,91.0952381 L603.904762,91.0952381 L603.904762,91.0894019 C613.940338,90.8366777 622,82.4081347 622,72.047619 C622,61.6871034 613.940338,53.2585603 603.904762,53.0058362 Z" id="Path"></path>
                    <path d="M382.911617,1.12345752 C423.661081,3.4102294 456,37.178535 456,78.5 C456,108.661292 440.269797,134.798407 416.001721,147.605926 L477.336555,229 L408.469094,229 L353.60159,156.188363 L326.145138,156.188363 L326.145138,228.979537 L265,228.979537 C265,228.979537 265,58.0737728 265.113846,10.2340253 C265.113846,5.19405194 269.681096,1.10370319 275.344954,1 L382.892896,1 C382.899137,1.04116117 382.905378,1.08231367 382.911617,1.12345752 Z M374,100.994554 C374.166229,100.998178 374.332902,101 374.5,101 C386.926407,101 397,90.9264069 397,78.5 C397,66.0735931 386.926407,56 374.5,56 C374.332902,56 374.166229,56.0018215 374,56.0054458 L374,56 L327,56 L327,101 L374,101 L374,100.994554 Z" id="Shape-Copy-21" fill-rule="nonzero"></path>
                    <path d="M0,115.710937 C0,179.613608 52.2925271,231.421874 116.792507,231.421874 C181.292493,231.421874 233.585014,179.613608 233.585014,115.710937 C233.585014,51.8082665 181.297986,3.55271368e-15 116.792507,3.55271368e-15 C52.2925271,3.55271368e-15 0,51.8082665 0,115.710937 Z M61.4238174,115.085473 C61.4238174,84.7083999 86.4944345,60.0854727 117.423817,60.0854727 C148.353202,60.0854727 173.423817,84.7083999 173.423817,115.085473 C173.423817,145.462545 148.348486,170.085473 117.423817,170.085473 C86.4944345,170.085473 61.4238174,145.462545 61.4238174,115.085473 Z" id="Shape-Copy-22" fill-rule="nonzero"></path>
                </g>
                <g id="Group" transform="translate(0.000000, 55.000000)" fill-rule="nonzero">
                    <path d="M45.276963,50.3222038 C88.1821895,33.1832347 114.830226,29.9597342 159.775447,20.4281759 C198.999259,12.1099601 208.825507,63.9665568 176.951216,87.3639773 C135.331777,117.914853 124.285066,90.6108269 102.801279,172.396674 C92.9432825,209.924725 26.9588078,204.305635 23.3946681,172.111322 C18.6245796,129.023863 19.7277304,136.269926 20.128075,103.530919 C20.4548476,76.8450085 25.7702131,58.1143912 45.276963,50.3222038 Z" id="notch-copy-3" fill="#8C60F9" transform="translate(107.851987, 108.990313) rotate(-14.000000) translate(-107.851987, -108.990313) "></path>
                    <path d="M36.6783271,51.4278971 C79.470112,34.3342438 106.04769,31.1192664 150.874077,21.6129096 C189.99418,13.3166871 200.787043,65.3224973 168.997028,88.6580548 C143.4176,107.434712 89.5362788,128.553376 51.9675828,128.930056 C28.5711181,129.164639 11.4424896,117.026885 11.5949101,104.495929 C11.9218414,77.8805758 17.2231531,59.1994824 36.6783271,51.4278971 Z" id="notch-copy-4" fill="#FF5959" transform="translate(99.606268, 74.829430) rotate(-14.000000) translate(-99.606268, -74.829430) "></path>
                    <path d="M32.971202,48.5373405 C75.8764289,31.3983713 102.524465,28.1748709 147.469686,18.6433126 C186.693498,10.3250968 197.514972,62.4687754 165.640681,85.8661954 C124.021242,116.417071 13.4644522,56.3295278 32.971202,48.5373405 Z" id="notch-copy-5" fill="#F4CA5F" transform="translate(107.497775, 56.108546) rotate(-14.000000) translate(-107.497775, -56.108546) "></path>
                </g>
            </g>
        </g>
    </g>
</svg>`

export const LogoHorizontal = memo((props: ViewProps & { slim?: boolean }) => {
  const theme = useTheme()
  const scaleDown = 0.08 + (props.slim ? 0 : 0.075)
  const w = 1441
  const h = 442

  return (
    <View
      color={theme.color.toString()}
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
      padding={[0, 20]}
      margin={[0, 0]}
      transform={{
        x: 2,
        y: -2,
        scale: scaleDown,
      }}
      width={w * scaleDown}
      height={h * scaleDown}
      zIndex={100000}
      {...useLink('/')}
      {...props}
    >
      <svg
        width={`${w}px`}
        height={`${h}px`}
        dangerouslySetInnerHTML={{
          __html: orbit.replace('fill="#000000"', 'fill="currentColor"'),
        }}
      />
    </View>
  )
})

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
