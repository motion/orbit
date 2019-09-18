import { createStoreContext } from '@o/use-store'
import { isDefined } from '@o/utils'
import { FullScreen } from 'gloss'
import React, { FunctionComponent, memo, useCallback, useEffect, useRef } from 'react'

import { Button } from './buttons/Button'
import { zIndex } from './constants'
import { Portal } from './helpers/portal'
import { useOnUnmount } from './hooks/useOnUnmount'
import { useWindowSize } from './hooks/useWindowSize'
import { Spinner } from './Spinner'
import { Message, MessageProps } from './text/Message'
import { SimpleText } from './text/SimpleText'
import { Col } from './View/Col'
import { Row } from './View/Row'

export type BannerProps = {
  /** Give the banner a title */
  title?: string
  /** The main content of the banner, can have multiple lines using a newline */
  message: string | React.ReactNode
  /** The theme of the banner */
  type?: 'warn' | 'success' | 'error' | 'info'
  /** Show a loading spinner */
  loading?: boolean
  /** In seconds, hide the banner automatically after this time */
  timeout?: number
  /** This is the callback you can pass in optionally to do things when it closes */
  onClose?: () => void
}

type BannerContent = Pick<BannerProps, 'title' | 'message' | 'type' | 'loading'>

type BannerItem = BannerContent & {
  key: number
  timeout?: number
  set: (props: Partial<BannerProps>) => void
  close: () => void
  onClose?: () => void
  isClosing?: boolean
}

class BannerStore {
  banners: BannerItem[] = []

  set(key: number, props: Partial<BannerProps>) {
    let banner = this.banners.find(x => x.key === key)

    const next = {
      message: props.message,
      loading:
        // by default: change loading to false if we are setting error/success
        props.type === 'error' || props.type === 'success'
          ? false
          : banner
          ? // otherwise just load the previous loading state, or false
            banner.loading
          : false,
      ...props,
    }

    if (!!banner) {
      this.banners = this.banners.map(x => (x === banner ? { ...x, ...next } : x))
    } else {
      this.show(next, key)
    }
  }

  show(banner: BannerProps, prevKey?: number) {
    const key = prevKey || Math.random()
    const bannerItem: BannerItem = {
      ...banner,
      key,
      set: this.set.bind(null, key),
      close: this.hide.bind(null, key),
    }
    this.banners = [...this.banners, bannerItem]
    return bannerItem
  }

  async hide(key: number) {
    const toRemove = this.banners.find(x => x.key === key)
    if (toRemove) {
      if (toRemove.onClose) {
        toRemove.onClose()
      }
      this.banners = this.banners.filter(x => x.key !== key)
    }
  }
}

const BannerManager = createStoreContext(BannerStore)

let GlobalBannerStore: BannerStore | null = null

// allows creation and use of banners outside React
export function createBanner() {
  return createBannerHandle(GlobalBannerStore!, { current: null })
}

export const ProvideBanner = memo(
  ({
    children,
    template = Banner,
  }: {
    children: any
    template?: FunctionComponent<BannerViewProps>
  }) => {
    const bannerStore = BannerManager.useCreateStore()
    GlobalBannerStore = bannerStore
    const BannerView = template

    return (
      <BannerManager.ProvideStore value={bannerStore}>
        {children}

        {/* default to a bottom fixed position, we can make this customizable */}
        <Portal>
          <FullScreen
            position="fixed"
            pointerEvents="none"
            top="auto"
            zIndex={zIndex.Banner}
            alignItems="flex-end"
            padding={[20, 10]}
          >
            {bannerStore.banners.map((banner, index) => {
              const id = `${JSON.stringify(banner).slice(0, 20)}${index}`
              return (
                <React.Fragment
                  key={id}
                  // id={id}
                  //   animateKey={banner.type}
                  // onExit={exitAnimate}
                >
                  <BannerView {...banner} close={() => bannerStore.hide(banner.key)} />
                </React.Fragment>
              )
            })}
          </FullScreen>
        </Portal>
      </BannerManager.ProvideStore>
    )
  },
)

// const exitAnimate = (el, _index, finish) => {
//   console.log('on exit banner, can animate here', el)
//   // el.style.background = 'green'
//   setTimeout(finish)
// }

export type BannerHandle = Pick<BannerItem, 'close' | 'set'>

function createBannerHandle(store: BannerStore, bannerRef: { current?: BannerItem }): BannerHandle {
  return {
    set: (props: Partial<BannerProps>) => {
      if (!store) {
        console.error('No banner store!')
        return
      }
      if (bannerRef.current) {
        bannerRef.current.set(props)
      } else {
        bannerRef.current = store.show({
          message: '',
          ...props,
        })
      }
    },
    close: () => {
      if (bannerRef.current) {
        bannerRef.current.close()
      }
    },
  }
}

/**
 * Use a single banner with helpers to manage it in the view its used
 */
export function useBanner(): BannerHandle {
  const bannerStore = BannerManager.useStore()
  const bannerRef = useRef<BannerItem>(null)
  const res = useRef(null)

  if (!res.current) {
    res.current = createBannerHandle(bannerStore, bannerRef)
  }

  useOnUnmount(() => {
    if (bannerRef.current) {
      bannerRef.current.close()
    }
  })

  return {
    set: useCallback(res.current.set, []),
    close: useCallback(res.current.close, []),
  }
}

/**
 * For showing many banners
 */
export function useBanners() {
  const bannerStore = BannerManager.useStore()
  return {
    show: bannerStore.show,
  }
}

export type BannerViewProps = MessageProps & BannerProps & { close: () => void }

export const Banner = (props: BannerViewProps) => {
  const { type, title, message, close, timeout, loading, ...rest } = props
  const [width, height] = useWindowSize({
    throttle: 50,
  })

  if (timeout > 50) {
    console.warn(
      'Timeouts in Banners are in seconds, not milliseconds, you may have set this accidentally',
      props,
    )
  }

  useEffect(() => {
    if (isDefined(timeout)) {
      let tm = setTimeout(close, timeout * 1000)
      return () => clearTimeout(tm)
    }
  }, [type, title, message, timeout])

  const maxHeight = Math.max(250, height * 0.33)
  return (
    <Message
      className="ui-banner"
      pointerEvents="auto"
      position="relative"
      alt={type || 'action'}
      sizeRadius
      margin="md"
      marginTop={0}
      overflow="hidden"
      padding
      elevation={2}
      alignSelf="flex-end"
      maxWidth={Math.max(200, width * 0.4)}
      background={useCallback(theme => theme.background, [])}
      {...rest}
    >
      <Row flex={1} justifyContent="space-between" alignItems="center" afterSpace beforeSpace space>
        {!!loading && <Spinner />}
        <Col flex={1} space="sm">
          <Message.Title>{title}</Message.Title>
          <Col maxHeight={maxHeight} scrollable="y">
            <SimpleText whiteSpace="pre" overflow="auto">
              {message}
            </SimpleText>
          </Col>
        </Col>
        <Button
          size="xxs"
          alignSelf="flex-start"
          chromeless
          icon="cross"
          iconSize={12}
          onClick={close}
        />
      </Row>
    </Message>
  )
}
