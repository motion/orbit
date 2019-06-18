import { BannerProps, Button, Row, useBanner } from '@o/ui'
import React, { useEffect, useState } from 'react'

export let Basic = () => {
  const banner = useBanner()
  const [props, setProps] = useState<BannerProps>({
    title: 'Empty',
  })

  useEffect(() => {
    if (props.title === 'Empty') return
    banner.set(props)
  }, [props])

  return (
    <Row space flexWrap="wrap">
      <Button
        onClick={() => {
          setProps({
            title: 'Info',
            message: `Lorem ipsum dolor sit info`,
            type: 'info',
          })
        }}
      >
        Show Info Banner
      </Button>
      <Button
        onClick={() => {
          setProps({
            title: 'Warning',
            message: `Lorem ipsum dolor sit warning`,
            type: 'warning',
          })
        }}
        alt="warn"
      >
        Show Warning Banner
      </Button>
      <Button
        onClick={() => {
          setProps({
            title: 'Error',
            message: `Lorem ipsum dolor sit error`,
            type: 'error',
          })
        }}
        alt="error"
      >
        Show Error Banner
      </Button>
    </Row>
  )
}
