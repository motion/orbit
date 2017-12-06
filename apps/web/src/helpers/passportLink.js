// @flow

function popup(url, title, win, w, h) {
  var y = win.top.screen.height / 2 - h / 2
  var x = win.top.screen.width / 2 - w / 2
  return win.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      y +
      ', left=' +
      x
  )
}

export default function passportLink(
  path: string,
  options: Object = {}
): Promise<any> {
  return new Promise((resolve, reject) => {
    const opts = {
      windowName: 'Login',
      width: 800,
      height: 600,
      ...options,
    }

    // setup new response object
    let resolved = false
    window.passport = {}
    window.passport.oauthSession = info => {
      if (!info.error && info.token) {
        resolved = true
        return resolve(info)
      }
      return reject(`Got an oauth error: ${JSON.stringify(info)}`)
    }

    const authWindow = popup(
      path,
      opts.windowName,
      window,
      opts.width,
      opts.height
    )
    if (!authWindow) {
      return reject('Authorization popup blocked')
    }
    let authComplete = false
    const check = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(check)
        if (!authComplete) {
          authComplete = true
          if (resolved) {
            return
          }
          return reject('Authorization cancelled')
        }
      }
    })
  })
}
