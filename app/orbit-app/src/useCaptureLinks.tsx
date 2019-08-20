import { command } from '@o/bridge'
import { OpenCommand } from '@o/models'
import { useEffect } from 'react'

// copied from orbit-app, TODO unfiy
export const useCaptureLinks = (node: any) => {
  // capture un-captured links
  // if you don't then clicking a link will cause electron to go there
  // this is a good safeguard
  useEffect(() => {
    if (!node) {
      return
    }
    const onClickLink = event => {
      if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault()
        console.log('Capturing a A tag from node', event.target.href)
        command(OpenCommand, { url: event.target.href })
      }
    }
    node.addEventListener('click', onClickLink)
    return () => {
      node.removeEventListener('click', onClickLink)
    }
  }, [node])
}
