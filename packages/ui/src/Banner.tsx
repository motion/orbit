import React, { FunctionComponent } from 'react'
import { createStoreContext } from '@o/use-store'
import { FullScreen } from 'gloss'
import { Message } from './text/Message'
import { remove } from 'lodash'
import { Button } from './buttons/Button'
import { Row } from './View/Row'

type BannerProps = {
  message: string
  type?: 'warn' | 'success' | 'fail'

  /** This is the callback you can pass in optionally to do things when it closes */
  onClose?: () => void
}

type BannerItem = BannerProps & {
  key: number
}

class BannerStore {
  banners: BannerItem[] = []

  show(banner: BannerProps) {
    this.banners = [...this.banners, { ...banner, key: Math.random() }]
  }

  hide(key: number) {
    const toRemove = this.banners.find(x => x.key === key)
    if (toRemove.onClose) {
      toRemove.onClose()
    }
    this.banners = remove(this.banners, x => x.key === key)
  }
}

const BannerManager = createStoreContext(BannerStore)

export function ProvideBanner({
  children,
  template = Banner,
}: {
  children: any
  template?: FunctionComponent<BannerViewProps>
}) {
  const bannerStore = BannerManager.useCreateStore()
  const BannerView = template
  return (
    <BannerManager.SimpleProvider value={bannerStore}>
      {children}

      {/* default to a bottom fixed position, we can make this customizable */}
      <FullScreen pointerEvents="none" top="auto">
        {bannerStore.banners.map(banner => (
          <BannerView
            key={JSON.stringify(banner)}
            {...banner}
            close={() => bannerStore.hide(banner.key)}
          />
        ))}
      </FullScreen>
    </BannerManager.SimpleProvider>
  )
}

export function useBanner() {
  return BannerManager.useStore()
}

export type BannerViewProps = BannerProps & { close: () => void }

export function Banner(props: BannerViewProps) {
  return (
    <Message sizeRadius={0} pointerEvents="auto" position="relative" alt={props.type}>
      <Row>
        {props.message}
        <Button chromeless icon="cross" iconSize={1.25} onClick={props.close} />
      </Row>
    </Message>
  )
}
