import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

export const Text = props => <UI.Text size={1.5} marginBottom={20} {...props} />
export const SubText = props => (
  <Text size={1.25} lineHeight="1.7rem" {...props} />
)
export const Hl = props => (
  <UI.Text display="inline" padding={[5]} background="yellow" {...props} />
)
export const Title = props => <Text fontWeight={800} {...props} />
export const SubTitle = props => (
  <UI.Title fontWeight={800} marginBottom={30} opacity={0.6} {...props} />
)

const dark = {
  background: Constants.colorBlue,
}
const padRight = {
  paddingRight: 300,
  [Constants.screen.small]: {
    paddingRight: 0,
  },
}

export const Section = view(
  'section',
  {
    marginLeft: -100,
    marginRight: -100,
    paddingLeft: 100,
    paddingRight: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  {
    padded: {
      padding: [110, 0],
      margin: 0,
    },
    dark,
  }
)

export const SectionContent = view(
  'section',
  {
    width: '85%',
    minWidth: 300,
    maxWidth: 800,
    margin: [0, 'auto'],
    position: 'relative',
    zIndex: 10,
  },
  {
    padRight,
    padBottom: {
      paddingBottom: 80,
    },
  }
)

export const Content = view(
  'div',
  {},
  {
    padRight,
  }
)

export const Hr = view('hr', {
  display: 'flex',
  height: 0,
  border: 'none',
  borderTop: [1, [0, 0, 0, 0.05]],
  paddingBottom: 20,
  marginTop: 20,
})

export const BottomSlant = view(
  'div',
  {
    position: 'absolute',
    bottom: -350,
    left: -500,
    right: -500,
    height: 400,
    zIndex: 0,
    transform: {
      rotate: '-1deg',
    },
  },
  {
    dark,
  }
)

export const Link = view('a', {
  color: '#5420a5',
  textDecoration: 'underline',
})

export const Strong = view('strong', {
  fontWeight: 500,
})

export const Logo = ({ fill, ...props }) => (
  <svg viewBox="0 0 498 157" {...props}>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Group-4" fill={fill}>
        <path
          d="M428.590792,122.971985 C428.590792,116.305319 428.590792,96.9698096 428.590792,64.9654579 L428.590792,35.4879188 L428.590792,22.5391884 L467.755343,21.8917274 L467.755343,37.4879188 L481.992647,37.4879188 L481.992647,75.9654579 L467.755343,75.9654579 C467.304569,90.8416458 467.181666,102.02227 467.386633,109.507332 C467.5916,116.992393 474.599426,119.147278 488.41011,115.971985 C494.41011,139.971985 497.41011,151.971985 497.41011,151.971985 C496.41011,152.971985 478.698196,156.971985 465.41011,156.971985 C450.41011,156.971985 428.590792,147.370423 428.590792,122.971985 Z"
          id="Path"
        />
        <polygon
          id="Path"
          points="375.302081 152.948368 375.302081 35.5073319 415.34505 35.5073319 415.34505 152.948368"
        />
        <path
          d="M284.836613,1.42108547e-14 L284.933548,37 C292.600215,32.6666667 300.751243,30.502444 309.386633,30.5073319 C332.021489,30.5201441 364.933548,49 364.375675,96.1573524 C363.817803,143.314705 336.285744,155.34875 308.58466,155.948368 C300.881274,156.115116 292.989757,153.46566 284.91011,148 L284.933548,154 C259.543895,154 246.210561,154 244.933548,154 C244.933548,145.333333 244.933548,94 244.933548,2.40855698e-14 L284.836613,1.42108547e-14 Z M303.763537,126.758879 C319.501199,126.835646 328.298329,112.605404 328.298329,95.2014667 C328.298329,77.7975292 322.889563,61.5073319 303.763537,61.5073319 C298.108062,61.5073319 291.831399,63.6715546 284.933548,68 L284.933548,117 C290.375509,123.471231 296.652172,126.724191 303.763537,126.758879 Z"
          id="Combined-Shape"
          transform="translate(304.658111, 77.977886) rotate(-360.000000) translate(-304.658111, -77.977886) "
        />
        <path
          d="M197.933548,48 C200.488235,41 213.238184,37 221.933548,37 C224.822806,37 229.15614,38.6666667 234.933548,42 L231.933548,81 C212.933548,71 197.933548,80.7558594 197.933548,102 L197.933548,152.948368 L158.933548,152.948368 L158.933548,38 L197.933548,38 L197.933548,48 Z"
          id="Path"
        />
        <path
          d="M20.884054,133.924116 C5.59164737,118.596145 0.70703125,102.534782 0.70703125,79.845118 C0.70703125,57.0843267 5.59164737,41.0051815 20.884054,25.7127748 C36.1764606,10.4203682 52.3626086,2.77427959 75.1233998,2.77427959 C97.8841911,2.77427959 114.070339,10.4203682 129.362746,25.7127748 C144.655152,41.0051815 149.539768,57.0843267 149.539768,79.845118 C149.539768,102.605909 144.655152,118.685055 129.362746,133.977461 C114.070339,149.269868 97.8841911,156.915956 75.1233998,156.915956 C52.3626086,156.915956 36.1764606,149.252086 20.884054,133.924116 Z M75.2342518,117.293559 C86.8777265,117.293559 94.5508872,112.621066 101.195061,105.445359 C107.839234,98.2696516 110.492723,89.2809976 110.492723,79.845118 C110.492723,70.4092384 108.135898,61.7409809 101.195061,54.2448771 C94.2542238,46.7487732 86.8192175,42.3966769 75.0587229,42.3966769 C63.4152483,42.3966769 55.9552903,46.8389108 49.0979141,54.2448771 C42.240538,61.6508433 40.7364658,70.3927815 40.7364658,79.845118 C40.7364658,89.2974545 42.4573928,98.2735959 49.0979141,105.445359 C55.7384355,112.617122 63.4737573,117.293559 75.2342518,117.293559 Z"
          id="Combined-Shape"
        />
      </g>
    </g>
  </svg>
)

export const Icon = ({ fill, ...props }) => (
  <svg viewBox="0 0 396 396" {...props}>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Custom-Preset" transform="translate(-58.000000, -58.000000)">
        <path
          d="M400.795627,309.284347 C406.953875,292.576393 410.315609,274.52289 410.315609,255.687029 C410.315609,169.82373 340.458986,100.217774 254.286475,100.217774 C168.113963,100.217774 98.25734,169.82373 98.25734,255.687029 C98.25734,341.550328 168.113963,411.156285 254.286475,411.156285 C260.969181,411.156285 267.553763,410.737671 274.015249,409.925324 C264.174408,400.932306 256.552412,389.583576 252.057174,376.780341 C185.955905,375.595706 132.737045,321.834032 132.737045,255.687029 C132.737045,188.798015 187.156578,134.573755 254.286475,134.573755 C321.416371,134.573755 375.835904,188.798015 375.835904,255.687029 C375.835904,264.319315 374.929552,272.740672 373.206497,280.86177 C384.57776,287.945949 394.075845,297.71962 400.795627,309.284347 Z"
          id="border"
          fill={fill}
        />
        <g
          id="Circle"
          transform="translate(258.779071, 274.755860) rotate(-3.000000) translate(-258.779071, -274.755860) translate(133.279071, 134.755860)"
        >
          <path
            d="M20.7356311,192.264605 C8.11631429,172.857679 0.769499347,149.554459 0.769499347,124.396002 C0.769499347,56.0237732 54.9924616,0.597130449 121.879875,0.597130449 C169.338736,0.597130449 210.421833,28.5009965 230.284218,69.1342417 C208.552365,35.99269 171.573707,14.1769504 129.610363,14.1769504 C62.7229495,14.1769504 8.49998727,69.6035931 8.49998727,137.975822 C8.49998727,157.449409 12.8985996,175.87284 20.7356311,192.264605 Z"
            id="Path"
            fill="#000000"
            opacity="0.0600000024"
          />
          <ellipse
            id="Path"
            fill={fill}
            cx="191.940484"
            cy="221.384129"
            rx="58.1147622"
            ry="58.6059326"
          />
        </g>
      </g>
    </g>
  </svg>
)
