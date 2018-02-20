/* global chrome io */

function getCurrentTab() {
  return new Promise(res => {
    chrome.tabs.query({ currentWindow: true, active: true }, function(
      tabArray,
    ) {
      res(tabArray[0])
    })
  })
}

const server = 'http://localhost:8000/'

async function run() {
  const tab = await getCurrentTab()
  if (!tab) return

  let debuggee = {}
  let app = {}
  let tabRef
  let socket = io(server, {
    autoConnect: false,
  })

  resetSockets(tab)

  async function resetSockets(tab) {
    console.log('resetSockets', tab)
    tabRef = tab
    debuggee.tabId = tab.id
    const target = await getDebuggerTarget()
    if (target.attached) {
      console.warn('debuggee.already attached')
      chrome.debugger.detach(debuggee)
    }
    if (target.url.startsWith('chrome://')) {
      return console.log('ERR ischrome')
    }
    attachDebuggerAndSocket(debuggee, tab)
  }

  function getDebuggerTarget() {
    return new Promise(resolve =>
      chrome.debugger.getTargets(targetsArr => {
        const arr = targetsArr.filter(t => t.tabId === debuggee.tabId)
        resolve(arr && arr[0])
      }),
    )
  }

  function attachDebuggerAndSocket(debuggee, tab) {
    console.log('debugger.attach', tab)
    chrome.debugger.attach(debuggee, '1.1', function() {
      console.log('debugger.attached')
    })
    if (socket && socket.connected) {
      console.log('socket.disconnecting previous socket')
      socket.disconnect()
    }
    socket.connect()
  }

  // socket-side
  app.onSocketConnect = function() {
    console.log('socket.connect')
    socket.on('data.request', app.onSocketDataRequest)
    socket.on('sessionCreated', app.onSessionCreated)
    socket.emit('hello', {
      title: tabRef.title,
      url: tabRef.url,
      userAgent: navigator.userAgent,
    })
  }

  app.onSocketDisconnect = function() {
    console.log('socket.disconnect')
    socket.off('data.request')
    socket.off('sessionCreated')
    getDebuggerTarget().then(target => {
      if (target && target.attached) {
        chrome.debugger.detach(debuggee, _ => console.log('debugger.detached'))
      }
    })
  }

  app.onSocketDataRequest = function(data) {
    console.log('socket.data.request', data.id, data)
    if (data.method === 'Page.canScreencast') {
      socket.emit('data.response', {
        id: data.id,
        result: {
          result: true,
        },
      })
      return
    }
    chrome.debugger.sendCommand(
      debuggee,
      data.method,
      data.params,
      function(response) {
        console.log('debugger.command.sent', data.id, response)
        socket.emit('data.response', {
          id: data.id,
          result: response,
        })
      }.bind(this),
    )
  }

  app.getURL = function(sessionId) {
    window
      .fetch(server + sessionId + '/json')
      .then(r => r.json())
      .then(targets => {
        console.log('Inspectable targets on ', server, ':')
        targets.forEach(t => {
          /* t looks like: {
          description: "",
          devtoolsFrontendUrl: "/devtools/devtools.html?ws=devtoolsremote.com/devtools/page/lQOtx1HAAC",
          devtoolsUrl: "chrome-devtools://devtools/remote/serve_rev/@06a2e…m/devtools/page/lQOtx1HAAC&remoteFrontend=true&dockSide=unlocked",
          id: "lQOtx1HuFkFfAQ3AAAAC",
          title: "chrome.debugger - Google Chrome",
          type: "page",
          url: "https://developer.chrome.com/extensions/debugger#type-TargetInfo",
          webSocketDebuggerUrl: "ws://devtoolsremote.com/devtools/page/lQOtx1HAAC"
        } */
          console.log('%c%s', 'font-weight: bold;', t.title)
          console.log('\t %c%s', 'color: gray; font-size: 90%;', t.url)
          console.log('\t Inspection URL: %c%s', 'color: blue;', t.devtoolsUrl)
        })
      })
  }

  socket.on('connect', app.onSocketConnect)
  socket.on('disconnect', app.onSocketDisconnect)

  app.onDebuggerEvent = function(source, method, params) {
    console.log('debugger.event.recieved', source, method, params)
    socket.emit('data.event', {
      method: method,
      params: params,
    })
  }

  app.onDebuggerDetach = function(debuggee, reason) {
    console.log('debugger.detached', reason)
    socket.disconnect()
  }

  app.onSessionCreated = function(sessionId) {
    console.log('sessionId', sessionId)
    app.getURL(sessionId)
  }

  chrome.debugger.onEvent.addListener(app.onDebuggerEvent)
  chrome.debugger.onDetach.addListener(app.onDebuggerDetach)
  chrome.runtime.onConnect.addListener(function(port) {
    console.log('whats this', port)
  })
  return true
}

let int = setInterval(async () => {
  if (await run()) {
    clearInterval(int)
  }
}, 500)

window.run = run
