import { Box, gloss, Image, Stack, View } from '@o/ui'
import React from 'react'

import { mediaQueries } from '../../constants'
import { FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContent } from '../../views/SectionContent'

const IntroPara = ({ delayIndex, stagger, ...props }) => (
  <FadeInView parallax delayIndex={delayIndex} stagger={stagger}>
    <Paragraph alpha={0.85} size={1.4} fontWeight={200} sizeLineHeight={1.4} {...props} />
  </FadeInView>
)

export default function IntroSection() {
  const Fade = useFadePage({
    threshold: 0,
  })

  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={-0.35}
        offset={-0.9}
        x="-5%"
        zIndex={-1}
        opacity={0.3}
        scale={3}
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      />
      <Page.BackgroundParallax
        speed={-0.25}
        offset={0.45}
        x="-5%"
        zIndex={0}
        opacity={0.1}
        scale={0.5}
        background="radial-gradient(circle closest-side, #FFF358, #FFF358 80%, transparent 85%, transparent)"
      />

      <SectionContent
        nodeRef={Fade.ref}
        position="relative"
        padding={['10vh', 0, '10vh']}
        zIndex={10}
      >
        <HalfGrid>
          {/* marginbottom is safari fix */}
          <View belowmd-marginBottom={50}>
            <FadeInView parallax>
              <Image
                display="block"
                src={require('../../public/images/screen1.jpeg')}
                width="100%"
                abovemd-marginLeft="-30%"
                abovemd-width="130%"
                abovesm-marginLeft="-50%"
                abovesm-width="150%"
                height="auto"
                maxWidth={1200}
                margin="auto"
                borderRadius={20}
                boxShadow={[
                  {
                    spread: 5,
                    blur: 80,
                    color: '#000',
                    y: 20,
                  },
                ]}
              />
            </FadeInView>
          </View>
          <Stack space="xl" justifyContent="center">
            <svg
              className="brand-mark"
              width="43px"
              height="53px"
              viewBox="0 0 43 53"
              style={{
                position: 'absolute',
                top: -100,
                right: -100,
              }}
            >
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="home" transform="translate(-760.000000, -31.000000)" fillRule="nonzero">
                  <g transform="translate(25.000000, -32.000000)">
                    <g transform="translate(735.000000, 63.000000)">
                      <path
                        d="M4.15309578,32.1280955 C4.58662941,32.9167853 5.25340762,33.5368306 6.11507116,33.9685898 C6.25897174,34.0406949 6.40805726,34.107507 6.56224442,34.1691096 C6.56262188,34.1897269 6.56301465,34.2103081 6.56342281,34.2308625 C6.6018013,36.163551 6.6052835,37.8788144 7.3150935,44.3403557 C7.4837425,45.875601 8.3606098,47.1959201 9.837338,48.1948295 C11.293817,49.1800416 13.2432607,49.7787765 15.2857775,49.8704957 C17.3677537,49.9639868 19.3894789,49.5257763 20.9844366,48.6114366 C22.674532,47.6425575 23.8214186,46.1891015 24.2987446,44.2926798 C25.4506197,39.7162661 26.5177732,36.385146 27.6260581,33.929568 L30.8882997,32.939124 C29.4814382,35.2108162 28.144836,38.9201556 26.6314206,44.9329731 C25.9797036,47.5222527 24.3964295,49.528745 22.1450837,50.8193715 C20.1439378,51.9665662 17.6859249,52.4993425 15.1821601,52.3869109 C12.7272055,52.2766712 10.360756,51.5498609 8.5260872,50.3088283 C6.47793142,48.9233858 5.17536477,46.9620815 4.91889824,44.6274156 C4.19958146,38.0793319 4.19258582,36.3253902 4.15203056,34.2830826 C4.14042539,33.6986619 4.14056919,33.1005239 4.15057686,32.3081002 C4.1511622,32.2617516 4.15202146,32.2006474 4.15309578,32.1280955 Z"
                        id="Shape"
                        fill="#8C60F9"
                        transform="translate(17.515746, 39.825101) rotate(-14.000000) translate(-17.515746, -39.825101) "
                      />
                      <path
                        d="M33.4535607,24.4819876 C29.1990074,27.6177854 23.910458,30.470676 18.5902663,32.4746134 C14.3738258,34.0628047 10.5017841,34.9625655 7.5129639,34.9988456 C5.85500625,35.0189709 4.45855567,34.7764 3.35948878,34.2358471 C2.08676505,33.6098847 1.23208552,32.5874876 0.91494795,31.2287149 C0.05748033,27.5549037 -0.21318991,24.6683724 0.17043488,22.2019562 C0.45395957,20.3791076 1.1017636,18.7983856 2.14209722,17.4528123 C2.1613452,17.9545741 2.3753259,18.4728899 2.75989571,18.9464092 C2.97437417,19.2104956 3.25008095,19.4681016 3.58405861,19.720661 C2.13663875,22.1589382 2.11973867,25.5838555 3.30069893,30.6436677 C3.58243816,31.8507765 4.93401533,32.5155213 7.4839159,32.4845691 C10.1532992,32.4521665 13.7676175,31.6122938 17.7441489,30.1144681 C21.1162925,28.844295 24.4777149,27.2155155 27.5376592,25.39916 C28.5180086,25.3469033 29.4701694,25.2551842 30.3855155,25.1223034 C31.4676642,24.9652078 32.4920486,24.7523621 33.4535607,24.4819876 Z"
                        id="notch-copy-6"
                        fill="#FF5959"
                      />
                      <path
                        d="M16.8065829,7.77535381 C17.9130605,7.18786306 18.9964314,6.57062403 20.3131321,5.92694147 C21.1831708,5.50161419 28.0399493,2.24623787 30.461525,1.04886392 C32.8319111,-0.12319884 35.1639864,-0.304758032 37.2309584,0.463017334 C39.142749,1.17315068 40.7160455,2.6612061 41.7396913,4.64423189 C43.8365843,8.70637189 43.3281026,14.0372071 40.1301325,17.9442443 C38.0298148,20.5102532 34.6501512,22.0483717 30.3302047,22.6769259 C26.6883882,23.2068119 22.4513151,23.0696408 18.185981,22.3772466 C14.3824744,21.759821 10.7880858,20.7278431 8.3606969,19.580448 C7.0799326,18.9750473 6.1454296,18.3515425 5.60621914,17.6861036 C4.76218662,16.6444842 4.75749109,15.3819546 5.85844308,14.5767658 C9.6964626,11.7698042 13.1635754,9.7096298 16.8065829,7.77535381 Z M9.3645065,17.339058 C11.5740757,18.3834927 14.9607125,19.3558234 18.5607983,19.9402275 C22.6058282,20.5968597 26.6091661,20.7264638 29.9934404,20.2340503 C33.780122,19.6830864 36.6310819,18.3855862 38.2920633,16.3563251 C40.8549611,13.2251709 41.2598194,8.9807065 39.6180201,5.80018233 C38.8629741,4.33749339 37.7405341,3.27586701 36.4143852,2.7832699 C34.9756529,2.24885377 33.3100514,2.37852594 31.5030339,3.27202509 C29.0602109,4.47990498 22.2428081,7.74316256 21.3909448,8.15960464 C20.0965247,8.79239508 18.9682913,9.36388773 17.887208,9.9378952 C14.4479709,11.7639782 11.2755803,13.7069193 7.6692195,16.3252638 C8.0069303,16.6160462 8.5883361,16.9721724 9.3645065,17.339058 Z"
                        id="notch-copy-7"
                        fill="#F5CA5C"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <IntroPara delayIndex={1} stagger={0} size={1.8}>
              <strong style={{ color: '#fff' }}>We're rethinking how we build and use apps</strong>
              &nbsp;with a powerful internal tool platform.
            </IntroPara>
            <IntroPara delayIndex={2} stagger={-0.5}>
              It's a powerful platform to build common apps for teams. With easy data plugins, a
              rich view kit, and a collaborative app-store.
            </IntroPara>
            <IntroPara delayIndex={3} stagger={-1}>
              Think of it as Bootstrap, designed for internal apps.
            </IntroPara>
          </Stack>
        </HalfGrid>
      </SectionContent>
    </Fade.FadeProvide>
  )
}

const HalfGrid = gloss(Box, {
  display: 'grid',
  columnGap: 50,

  [mediaQueries.abovemd]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
})
