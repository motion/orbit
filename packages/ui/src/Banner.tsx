import { createStoreContext } from '@o/use-store'
import { isDefined } from '@o/utils'
import { FullScreen } from 'gloss'
import { filter } from 'lodash'
import React, { FunctionComponent, memo, useCallback, useEffect, useRef } from 'react'

import { Button } from './buttons/Button'
import { FlipAnimate, FlipAnimateItem } from './FlipAnimate'
import { Portal } from './helpers/portal'
import { useOnUnmount } from './hooks/useOnUnmount'
import { Message, MessageProps } from './text/Message'
import { SimpleText } from './text/SimpleText'
import { Col } from './View/Col'
import { Row } from './View/Row'

export type BannerProps = {
  /** Give the banner a title */
  title?: string
  /** The main content of the banner, can have multiple lines using a newline */
  message: string
  /** The theme of the banner */
  type?: 'warn' | 'success' | 'error' | 'info'
  /** In seconds, hide the banner automatically after this time */
  timeout?: number
  /** This is the callback you can pass in optionally to do things when it closes */
  onClose?: () => void
}

type BannerContent = Pick<BannerProps, 'title' | 'message' | 'type'>

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
    if (!!banner) {
      this.banners = this.banners.map(x => (x === banner ? { ...x, ...props } : x))
    } else {
      this.show({ ...props, message: props.message }, key)
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
      this.banners = filter(this.banners, x => x.key !== key)
    }
  }
}

const BannerManager = createStoreContext(BannerStore)

export const ProvideBanner = memo(
  ({
    children,
    template = Banner,
  }: {
    children: any
    template?: FunctionComponent<BannerViewProps>
  }) => {
    const bannerStore = BannerManager.useCreateStore()
    const BannerView = template

    return (
      <BannerManager.SimpleProvider value={bannerStore}>
        {children}

        {/* default to a bottom fixed position, we can make this customizable */}
        <Portal>
          <FullScreen
            position="fixed"
            pointerEvents="none"
            top="auto"
            zIndex={1000000000}
            alignItems="flex-end"
          >
            <FlipAnimate>
              {bannerStore.banners.map(banner => {
                const id = JSON.stringify(banner)
                return (
                  <FlipAnimateItem id={id} key={id} animateKey={banner.type}>
                    <BannerView {...banner} close={() => bannerStore.hide(banner.key)} />
                  </FlipAnimateItem>
                )
              })}
            </FlipAnimate>
          </FullScreen>
        </Portal>
      </BannerManager.SimpleProvider>
    )
  },
)

export type BannerHandle = Pick<BannerItem, 'close' | 'set'>

/**
 * Use a single banner with helpers to manage it in the view its used
 */
export function useBanner(): BannerHandle {
  const bannerStore = BannerManager.useStore()
  const banner = useRef<BannerItem>(null)

  useOnUnmount(() => {
    if (banner.current) {
      banner.current.close()
    }
  })

  return {
    set: useCallback((props: Partial<BannerProps>) => {
      if (banner.current) {
        banner.current.set(props)
      } else {
        banner.current = bannerStore.show({
          message: '',
          ...props,
        })
      }
    }, []),
    close: useCallback(() => {
      if (banner.current) {
        banner.current.close()
      }
    }, []),
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

export const Banner = ({ type, title, message, close, timeout, ...rest }: BannerViewProps) => {
  useEffect(() => {
    if (isDefined(timeout)) {
      let tm = setTimeout(close, timeout * 1000)
      return () => clearTimeout(tm)
    }
  }, [timeout])

  return (
    <Message
      className="ui-banner"
      pointerEvents="auto"
      position="relative"
      alt={type}
      sizeRadius
      margin="md"
      marginTop={0}
      overflow="hidden"
      elevation={3}
      alignSelf="flex-end"
      background={useCallback(theme => theme.background, [])}
      {...rest}
    >
      <Row flex={1} justifyContent="space-between" alignItems="center" afterSpace>
        <Col space="xs">
          <Message.Title>{title}</Message.Title>
          <SimpleText whiteSpace="pre">{message}</SimpleText>
        </Col>
        <Button alignSelf="flex-start" chromeless icon="cross" iconSize={14} onClick={close} />
      </Row>
    </Message>
  )
}
