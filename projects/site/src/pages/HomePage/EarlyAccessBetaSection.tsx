import sepFilled from '!raw-loader!../../../public/images/line-sep-filled.svg'
import sep from '!raw-loader!../../../public/images/line-sep.svg'
import { Button, Col, Form, gloss, Input, Message, Space, SVG, useTheme, View, ViewProps } from '@o/ui'
import jsonp from 'jsonp'
import React, { memo } from 'react'

import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'

export default function EarlyAccessSection({ outside = null, ...props }: any) {
  return (
    <Page zIndex={1} {...props}>
      <Page.Content
        zIndex={10}
        outside={
          <>
            <LineSep top={-10} fill />
            {outside}
          </>
        }
      >
        {/* offset header stripe */}
        <View height={20} />

        <View margin={['auto', 0]} transform={{ y: '-3%' }}>
          <EarlyAccessContent />
        </View>
      </Page.Content>

      <Page.Background background={theme => theme.background} top={80} />
    </Page>
  )
}

export const LineSep = memo(({ fill = null, ...props }: ViewProps & { fill?: any }) => {
  const theme = useTheme()
  const svg = fill
    ? sepFilled.replace('fill="#000000"', `fill="${fill === true ? theme.background.hex() : fill}"`)
    : sep
  return (
    <View
      color={theme.background}
      position="absolute"
      top={0}
      width="100%"
      minWidth={1200}
      height={100}
      {...props}
    >
      <SVG svg={svg} width="100%" />
    </View>
  )
})

export const EarlyAccessContent = () => {
  return (
    <SpacedPageContent
      header={
        <>
          <PillButton>Beta</PillButton>
          <Space size="sm" />
          <TitleText size="xxl">Early Access.</TitleText>
          <TitleTextSub size={useScreenVal('sm', 'md', 'md')}>Orbit is now in beta.</TitleTextSub>
          <TitleTextSub>Have a unique case for internal tools? Contact us.</TitleTextSub>
        </>
      }
    >
      <SignupForm />
    </SpacedPageContent>
  )
}

export const SignupForm = (props: ViewProps) => (
  <View
    width="50%"
    maxWidth={600}
    minWidth={340}
    margin="auto"
    borderRadius={12}
    overflow="hidden"
    elevation={3}
    {...props}
  >
    <Wavy width="100%" height={16} />
    <View pad="lg">
      <Join
        header={
          <>
            <TitleTextSmallCaps alpha={1}>Beta Signup</TitleTextSmallCaps>
            <Space size="sm" />
            <TitleTextSub size="xs">We're rolling out to teams now.</TitleTextSub>
          </>
        }
        space="lg"
      />
    </View>

    <Wavy width="100%" height={16} />
  </View>
)

const TitleTextSmallCaps = props => (
  <TitleTextSub letterSpacing={2} textTransform="uppercase" size={0.2} {...props} />
)

export const purpleWaveUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%234b2c80' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%2352308c' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%23593499' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%236139a5' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%23683db2' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%236e41bc' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%237444c7' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%237a48d1' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%23814cdc' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%238750e7' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E")`
export const purpleWave = {
  backgroundColor: '#442874',
  backgroundImage: purpleWaveUrl,
}

export const wavyUrl = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%23ff9300' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%23ffa200' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%23ffb000' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%23ffbe00' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%23ffcc00' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%23ffd624' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%23ffe038' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%23ffeb49' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%23fff558' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%23ffff66' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E")`
const orangeWave = {
  backgroundColor: '#ff8400',
  backgroundImage: wavyUrl,
}

export const Wavy = gloss(View, {
  backgroundAttachment: 'fixed',
  backgroundSize: 'contain',
}).theme((_, theme) => (theme.background.isDark() ? purpleWave : orangeWave))

const queryString = query => {
  const esc = encodeURIComponent
  return Object.keys(query)
    .map(k => `${esc(k)}=${k === 'c' ? query[k] : esc(query[k])}`)
    .join('&')
}

export class Join extends React.Component<any> {
  state = {
    error: null,
    success: null,
    submitting: false,
  }

  form = React.createRef<HTMLFormElement>()
  email = React.createRef<HTMLInputElement>()

  clearState() {
    this.setState({ error: null, success: null, submitting: false })
  }

  submit = async e => {
    console.log('got submit')
    e.preventDefault()
    this.clearState()
    this.setState({ submitting: true })
    try {
      const finish = state => {
        this.clearState()
        this.setState(state)
      }
      console.log('this.form', this.form)
      const form = this.form.current
      const query = {
        id: '015e5a3442',
        EMAIL: this.email.current.value,
        b_019909d3efb283014d35674e5_015e5a3442: '',
      }
      let url = form.getAttribute('action').replace('/post', '/post-json')
      url = `${url}&${queryString(query)}`
      jsonp(url, { param: 'c' }, (error, data) => {
        if (error) {
          return finish({ error })
        }
        if (data && data.result === 'error') {
          return finish({ error: data.msg })
        }
        return finish({ success: data.msg })
      })
    } catch (err) {
      console.log('errrr', err)
      this.clearState()
      this.setState({ error: err.message })
    }
  }

  render() {
    const { success, error, submitting } = this.state
    const { header, ...props } = this.props
    const message = success || error || ''
    return (
      <>
        <Form
          action="https://tryorbit.us18.list-manage.com/subscribe/post?u=019909d3efb283014d35674e5"
          method="post"
          id="mc-embedded-subscribe-form-1"
          name="mc-embedded-subscribe-form"
          target="_blank"
          ref={this.form}
          onSubmit={this.submit}
          {...props}
        >
          {header}

          <Input
            type="email"
            ref={this.email}
            name="EMAIL"
            id="mce-EMAIL"
            placeholder="Email address..."
            flex={0}
            size={2}
            sizeRadius={5}
            sizePadding={1.5}
          />

          <Button
            size={2}
            sizeRadius={5}
            sizeFont={0.8}
            sizePadding={2}
            margin={[0, '20%']}
            type="submit"
            disabled={submitting}
            opacity={submitting ? 0.5 : 1}
            pointerEvents={submitting ? 'none' : 'auto'}
            cursor="pointer"
          >
            Early access
          </Button>
        </Form>
        {!!message && (
          <Col maxWidth={500} margin={[0, 'auto']}>
            <Space size="lg" />
            <Message
              alt={success ? 'success' : error ? 'error' : undefined}
              dangerouslySetInnerHTML={{
                __html: message,
              }}
            />
          </Col>
        )}
      </>
    )
  }
}
